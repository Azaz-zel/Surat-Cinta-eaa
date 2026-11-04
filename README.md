# Surat Cinta

Web surat cinta digital untuk satu penerima. Penerima membuka link `/s/<slug>`, mengetuk amplop, lalu surat terbuka lengkap dengan buket bunga bergaya tinta dan cat air. Pemilik membuat dan mengedit surat lewat panel admin di `/admin`.

Spec desain: [`docs/superpowers/specs/2026-11-04-surat-cinta-design.md`](docs/superpowers/specs/2026-11-04-surat-cinta-design.md).

## Stack

- Next.js 16 (App Router, `proxy.ts` untuk melindungi `/admin/*`) + TypeScript + React 19
- Supabase: Auth (email + password), Postgres dengan RLS, Storage privat
- Zod untuk skema `config` surat (dipakai di builder dan di server)
- Animasi CSS; bunga, daun, pembungkus, dan stempel digambar sebagai komponen SVG

## Setup

1. **Buat proyek Supabase**, lalu jalankan migrasi di `supabase/migrations/` (lewat SQL editor atau `supabase db push`). Migrasi ini membuat tabel `letters` beserta RLS, bucket privat `media`, dan policy Storage-nya.
2. **Buat akun admin** di Supabase Dashboard › Authentication › Users › Add user (email + password).
3. **Matikan pendaftaran publik** di Authentication › Sign In / Providers › nonaktifkan "Allow new users to sign up", supaya hanya akunmu yang bisa login.
4. **Isi environment**: salin `.env.example` ke `.env.local`, lalu isi URL, anon key, service role key, dan `NEXT_PUBLIC_SITE_URL` (alamat https publik web ini, dipakai untuk gambar preview link).
5. Jalankan:

   ```bash
   npm install
   npm run dev        # http://localhost:3000/admin
   ```

## Deploy ke server sendiri

```bash
npm ci
npm run build
npm start          # next start, default port 3000
```

Web ini harus bisa dibuka publik lewat HTTPS supaya link surat bisa dibuka dari luar jaringanmu, misalnya lewat Tailscale Funnel (`tailscale funnel --bg 3003`), Cloudflare Tunnel, atau reverse proxy (Nginx atau Caddy) dengan domain. Link share mengikuti alamat yang kamu pakai untuk membuka `/admin`, jadi buka admin lewat alamat https itu. Isi env yang sama di server. `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server dan tidak pernah dikirim ke browser.

## Keamanan singkat

- Tabel `letters` memakai RLS: hanya pemilik (`owner_id = auth.uid()`) yang bisa select, insert, update, dan delete. Role anon tidak punya policy, jadi daftar surat tidak bisa diambil lewat API publik.
- `/s/[slug]` membaca satu surat memakai service role di server, lalu membuat signed URL (berlaku 6 jam) untuk musik dan foto.
- Media disimpan di `media/<user id>/...`. Batas ukuran dicek di browser dan di server: bucket menolak file di atas 10 MB, dan aksi simpan mengecek ukuran asli di Storage (MP3 maks. 10 MB, foto maks. 5 MB).
- Metadata link (preview WhatsApp) hanya memuat nama penerima, tidak memuat isi surat.

## Tes

```bash
npm test           # unit test: arrangeBouquet dan skema config
npm run test:e2e   # Playwright di viewport 375px dan 1440px
```

Tes e2e butuh proyek Supabase sungguhan dan server yang sedang berjalan. Isi `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, dan opsional `E2E_BASE_URL` (default `http://localhost:3000`). Tanpa variabel itu tesnya di-skip. Tes ini membuat satu surat bernama "Tes E2E" yang bisa kamu hapus dari panel admin.

## Struktur

```
src/
  app/
    admin/login/        form login
    admin/(app)/        daftar surat, /admin/new, /admin/[id]
    admin/actions.ts    server actions: login, logout, simpan, hapus
    s/[slug]/           halaman penerima + halaman "tidak ditemukan"
  components/
    art/                ArtDefs (filter SVG), Flower (17 jenis), Greenery, Bouquet, Envelope
    letter/             LetterExperience (amplop → surat), LetterPaper, Petals
    builder/            Builder 6 langkah + panel tiap langkah
  lib/letter/           options, schema (Zod), defaults, arrange (PRNG ber-seed)
  proxy.ts              redirect /admin/* ke login bila belum masuk
supabase/migrations/    tabel, RLS, bucket Storage
```
