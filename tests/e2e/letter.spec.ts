import { expect, test } from '@playwright/test';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.skip(!email || !password, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run against a real Supabase project');

test('login, create a letter, open the link, envelope opens', async ({ page, context }) => {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(email!);
  await page.getByLabel('Password').fill(password!);
  await page.getByRole('button', { name: 'Masuk' }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto('/admin/new');
  await page.getByRole('button', { name: 'Langkah 3: Surat' }).click();
  await page.getByLabel('Nama penerima').fill('Tes E2E');
  await page.getByLabel('Isi surat').fill('Halo dari tes otomatis.');
  await page.getByLabel('Nama pengirim').fill('Playwright');
  await page.getByRole('button', { name: 'Langkah 6: Simpan & bagikan' }).click();
  await page.getByRole('button', { name: 'Generate link' }).click();

  const link = page.getByLabel('Link surat');
  await expect(link).toHaveValue(/\/s\/[A-Za-z0-9_-]{10}$/);
  const url = await link.inputValue();

  const recipient = await context.newPage();
  await recipient.goto(url);
  await expect(recipient.getByRole('heading', { name: 'Untuk Tes E2E' })).toBeVisible();
  await recipient.getByRole('button', { name: 'Buka surat' }).click();
  await expect(recipient.getByText('Halo dari tes otomatis.')).toBeVisible({ timeout: 5000 });
  await expect(recipient.getByRole('button', { name: 'Tutup surat' })).toBeVisible();
});
