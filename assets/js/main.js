// Ganti dengan alamat email resmi perusahaan sebelum rilis.
const CONTACT_EMAIL = 'ALAMAT_EMAIL_PERUSAHAAN';

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

const clean = (s, max) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
const form = document.getElementById('form-kontak');
const status = document.getElementById('status');

form.addEventListener('submit', e => {
  e.preventDefault();
  const v = {
    nama: clean(form.nama.value, 100),
    email: clean(form.email.value, 120),
    subjek: clean(form.subjek.value, 150),
    pesan: clean(form.pesan.value, 1000)
  };
  const errors = {
    nama: v.nama ? '' : 'Nama wajib diisi.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? '' : 'Masukkan alamat email yang valid.',
    subjek: v.subjek ? '' : 'Subjek wajib diisi.',
    pesan: v.pesan.length >= 10 ? '' : 'Pesan minimal 10 karakter.'
  };
  let first = null;
  for (const k in errors) {
    document.getElementById('err-' + k).textContent = errors[k];
    if (errors[k] && !first) first = k;
  }
  status.textContent = '';
  if (first) { form[first].focus(); return; }
  if (CONTACT_EMAIL === 'ALAMAT_EMAIL_PERUSAHAAN') {
    status.textContent = 'Alamat email tujuan belum diatur. Hubungi pengelola situs.';
    return;
  }
  const body = `Nama: ${v.nama}\nEmail: ${v.email}\n\n${v.pesan}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(v.subjek)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Aplikasi email Anda dibuka. Kirim pesan dari sana untuk menyelesaikan.';
});
