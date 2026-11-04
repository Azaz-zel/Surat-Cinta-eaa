# Surat Cinta — Design Spec

Tanggal: 2026-11-04
Status: menunggu review

## Tujuan

Web surat cinta digital untuk satu penerima (pacar pemilik). Penerima membuka link, melihat amplop, mengetuknya, lalu surat terbuka dengan animasi dan menampilkan buket bunga serta kata-kata. Pemilik membuat dan mengedit surat lewat panel admin, lalu mendapat link untuk dikirim.

Harus berjalan baik di HP dan desktop.

### Kriteria sukses

- Link `/s/[slug]` terbuka di HP penerima tanpa login, dan animasi amplop berjalan mulus.
- Pemilik bisa membuat surat lengkap (bunga, wrapping, surat, amplop, ekstra) dan mendapat link dalam satu alur builder.
- Edit surat setelah dikirim tidak mengubah link.
- Orang lain tidak bisa membuat, mengedit, atau mengambil daftar surat.

### Di luar scope

- Banyak pengguna admin atau pendaftaran akun publik.
- Penyusunan bunga dengan drag manual.
- Link YouTube/Spotify untuk musik.
- Statistik atau notifikasi saat surat dibuka.

## Stack

- Next.js (App Router) + TypeScript + React.
- Supabase: Auth (email + password), Postgres, Storage.
- Animasi: CSS + Motion (Framer Motion).
- Bunga, daun, wrapping, dan stempel digambar sebagai komponen SVG dengan warna lewat props.
- Tema visual: burgundy-wine dari 21st.dev (token shadcn/ui). Token warna dimasukkan saat tahap desain visual.
- Deploy: satu proses Node (`next start`) di server pribadi pemilik.

## Arsitektur

### Halaman

| Route | Akses | Isi |
|-------|-------|-----|
| `/admin/login` | publik | Form login email + password |
| `/admin` | login | Daftar surat: edit, salin link, hapus |
| `/admin/new` | login | Builder surat baru |
| `/admin/[id]` | login | Builder untuk surat yang sudah ada |
| `/s/[slug]` | publik | Pengalaman penerima |

Middleware Next.js mengalihkan semua `/admin/*` kecuali `/admin/login` ke halaman login bila sesi tidak ada.

### Database

Tabel `letters`:

| Kolom | Tipe | Catatan |
|-------|------|---------|
| `id` | uuid, PK | default `gen_random_uuid()` |
| `slug` | text, unique | 10 karakter acak (alfabet URL-safe), dibuat server |
| `owner_id` | uuid | referensi `auth.users.id` |
| `recipient_name` | text | untuk daftar admin dan preview WhatsApp |
| `config` | jsonb | seluruh kustomisasi, divalidasi dengan skema Zod |
| `created_at` | timestamptz | default `now()` |
| `updated_at` | timestamptz | diperbarui saat edit |

`config` disimpan sebagai satu kolom JSON agar opsi baru tidak membutuhkan migrasi. Skema Zod menjadi satu-satunya sumber bentuk data dan dipakai di builder serta di server.

Bentuk `config`:

```ts
type LetterConfig = {
  bouquet: {
    flowers: { type: FlowerType; color: string }[]; // 3–15 tangkai
    greenery: GreeneryType[];
    wrap: { paper: WrapPaper; color: string };
    ribbon: { style: RibbonStyle; color: string };
    seed: number;
  };
  letter: {
    to: string;
    body: string;
    from: string;
    font: LetterFont;
    paper: LetterPaper;
    textSize: 'sm' | 'md' | 'lg';
  };
  envelope: {
    color: string;
    seal: SealMotif;
    sealColor: string;
    liner: 'plain' | 'pattern';
    initial?: string; // dipakai bila seal = 'initial'
  };
  extras: {
    musicPath?: string; // path di bucket media
    photoPath?: string;
    petals: { enabled: boolean; color: string };
  };
};
```

### Keamanan

- RLS aktif di `letters`. Policy: hanya baris dengan `owner_id = auth.uid()` yang bisa di-select, insert, update, dan delete.
- Role anonim tidak punya policy apa pun, sehingga daftar surat tidak bisa diambil lewat API Supabase publik.
- `/s/[slug]` mengambil surat di server component memakai service role key. Key hanya ada di env server (`SUPABASE_SERVICE_ROLE_KEY`) dan tidak pernah dikirim ke browser.
- Bucket Storage `media` bersifat privat. Upload hanya oleh pemilik (policy berdasarkan folder `owner_id/`). Saat `/s/[slug]` dirender, server membuat signed URL berlaku 6 jam untuk MP3 dan foto.

### Preview link

`generateMetadata` di `/s/[slug]` menghasilkan judul "Ada surat untuk [recipient_name] 💌" dan gambar OG statis bertema. Isi surat tidak dimasukkan ke metadata.

### Susunan buket

Fungsi murni `arrangeBouquet(flowers, greenery, seed)` mengembalikan posisi, rotasi, skala, dan urutan lapisan tiap elemen. Fungsi memakai PRNG ber-seed, sehingga seed yang sama selalu menghasilkan susunan yang sama. Tombol "acak susunan" hanya mengganti `seed`.

## Pengalaman penerima (`/s/[slug]`)

1. **Layar amplop.** Latar burgundy bertekstur kertas halus. Amplop di tengah, responsif. Nama penerima dan stempel lilin di depan amplop, sesuai warna dan motif pilihan. Amplop bergoyang pelan, dengan teks "ketuk untuk membuka".
2. **Animasi membuka** (sekitar 2,5 detik, dipicu ketukan):
   1. Stempel retak dan jatuh.
   2. Penutup amplop membuka ke atas (rotasi 3D).
   3. Surat naik keluar dari amplop.
   4. Amplop turun dan menghilang.
   5. Surat membesar memenuhi layar.

   Musik mulai di ketukan ini, karena browser HP memblokir audio otomatis.
3. **Isi surat** (kertas yang bisa di-scroll):
   - Buket di atas. Bunga mekar bertahap satu per satu.
   - "Untuk [nama]", isi surat dengan font pilihan, lalu "Dari [pengirim]".
   - Foto gaya polaroid di bawah, hanya bila ada.
   - Kelopak jatuh di latar, bila diaktifkan.
4. **Kontrol:** tombol musik on/off dan tombol "tutup surat" untuk kembali ke amplop.

### Kasus khusus

- Slug tidak ada atau surat dihapus: halaman "Surat ini tidak ditemukan" bertema sama.
- `prefers-reduced-motion`: animasi diganti fade, kelopak jatuh dimatikan.
- MP3 atau foto gagal dimuat: bagian itu dilewati, surat tetap tampil.

## Builder admin

Layout desktop: panel opsi di kiri, preview langsung di kanan. Layout HP: opsi layar penuh, dengan tombol "Lihat preview" yang membuka preview layar penuh. Ada 6 step dengan progress bar. Semua step bisa dibuka kapan pun.

1. **Bunga.** 17 jenis: mawar, peony, tulip, lily, spider lily, daisy, sunflower, ranunculus, anemone, carnation, dahlia, orchid, zinnia, lavender, hydrangea, cosmos, gerbera. Pilih per tangkai, total 3–15. Warna per tangkai: 8 preset per jenis plus color picker. Tombol "acak susunan".
2. **Daun dan wrapping.** Daun pengisi (bisa lebih dari satu): eucalyptus, baby's breath, fern, ruscus, olive, monstera. Kertas pembungkus: kraft, linen, tissue berlapis, koran vintage, satin, transparan, dengan warna bisa diatur. Pita: simpul, pita panjang, tali rami, dengan warna bisa diatur.
3. **Surat.** Nama penerima, isi, nama pengirim. 5 font tulisan tangan. 4 kertas: polos, bergaris, kertas tua, deckled edge. Ukuran teks sm/md/lg.
4. **Amplop.** 8 warna preset plus color picker. 6 motif stempel: hati, inisial, mawar, bintang, bulan, infinity. 6 warna lilin. Lapisan dalam polos atau bermotif.
5. **Ekstra.** Upload MP3 (maks 10 MB) dengan tombol coba putar. Upload foto (maks 5 MB), dikompres di browser sebelum upload. Kelopak jatuh on/off dengan pilihan warna.
6. **Simpan dan bagikan.** "Generate link" menyimpan ke database, lalu menampilkan link dengan tombol salin dan tombol bagikan (Web Share API, fallback ke salin). Edit surat yang sudah ada memakai link yang sama.

### Error

- Simpan atau upload gagal: pesan error tampil, isian tidak hilang.
- Draft builder otomatis disimpan ke `localStorage` selama builder terbuka. Draft dihapus setelah generate berhasil.
- Validasi Zod di server menolak `config` yang tidak sesuai skema. Batas ukuran file juga dicek di server/Storage, bukan hanya di browser.

## Testing

- Unit test `arrangeBouquet`: seed sama menghasilkan output sama, dan seed berbeda menghasilkan output berbeda.
- Unit test skema `config`: data valid diterima, data tidak valid ditolak (misal jumlah tangkai di luar 3–15).
- Satu tes end-to-end Playwright: login, buat surat, buka link, amplop terbuka. Dijalankan di viewport 375px dan 1440px.

## Tahap berikutnya

1. Desain visual di Claude Design (layar amplop, animasi membuka, isi surat, builder admin) memakai token burgundy-wine.
2. Setelah desain disetujui pemilik: implementation plan, lalu kode.
