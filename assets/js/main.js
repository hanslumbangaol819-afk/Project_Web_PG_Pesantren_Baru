// Alamat email resmi tujuan formulir kontak
const CONTACT_EMAIL = 'hanslumbangaol819@gmail.com';

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
const btnMailto = document.getElementById('btn-mailto');

const validateForm = () => {
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
  if (first) {
    form[first].focus();
    return null;
  }
  return v;
};

// Kirim via Gmail Web (Langsung membuka tab Gmail dengan alamat tujuan, subjek, dan draf pesan terisi lengkap)
form.addEventListener('submit', e => {
  e.preventDefault();
  const v = validateForm();
  if (!v) return;

  const subject = `[Pesan PG Pesantren Baru] ${v.subjek}`;
  const body = `Halo Tim Manajemen PG Pesantren Baru,\n\nNama Pengirim: ${v.nama}\nEmail Pengirim: ${v.email}\nTopik / Subjek: ${v.subjek}\n\nIsi Pesan:\n${v.pesan}\n\n---\nDikirim melalui formulir kontak web PG Pesantren Baru`;

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const win = window.open(gmailUrl, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = gmailUrl;
  }

  status.className = 'ok success';
  status.innerHTML = `<strong>Tab Gmail berhasil dibuka!</strong><br>Pesan dan alamat penerima <u>${CONTACT_EMAIL}</u> sudah terisi otomatis. Silakan klik tombol <strong>Kirim</strong> di tab Gmail Anda.`;
});

// Opsi alternatif: Kirim via aplikasi email desktop (Outlook / Apple Mail / Mailto)
if (btnMailto) {
  btnMailto.addEventListener('click', () => {
    const v = validateForm();
    if (!v) return;

    const subject = `[Pesan PG Pesantren Baru] ${v.subjek}`;
    const body = `Nama Pengirim: ${v.nama}\nEmail Pengirim: ${v.email}\nTopik: ${v.subjek}\n\nIsi Pesan:\n${v.pesan}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.className = 'ok success';
    status.innerHTML = `Aplikasi email default Anda dibuka dengan tujuan <u>${CONTACT_EMAIL}</u>. Silakan selesaikan pengiriman dari aplikasi tersebut.`;
  });
}
