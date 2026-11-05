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
const btnKirim = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async e => {
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
  status.className = 'ok';
  if (first) { form[first].focus(); return; }

  const originalBtnText = btnKirim.textContent;
  btnKirim.disabled = true;
  btnKirim.textContent = 'Sedang mengirim pesan...';

  try {
    const formData = new FormData();
    formData.append('Nama Pengirim', v.nama);
    formData.append('Email Pengirim', v.email);
    formData.append('_subject', `[Pesan PG Pesantren Baru] ${v.subjek}`);
    formData.append('Topik / Subjek', v.subjek);
    formData.append('Isi Pesan', v.pesan);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    const data = await res.json();
    if (res.ok && (data.success === 'true' || data.success === true)) {
      status.className = 'ok success';
      status.textContent = 'Pesan Anda berhasil dikirim langsung ke hanslumbangaol819@gmail.com! Terima kasih.';
      form.reset();
    } else {
      throw new Error(data.message || 'Gagal mengirim pesan');
    }
  } catch (err) {
    console.error('Submit error:', err);
    status.className = 'ok error';
    status.textContent = 'Terjadi kendala saat mengirim pesan. Pastikan perangkat terhubung ke internet dan coba kembali.';
  } finally {
    btnKirim.disabled = false;
    btnKirim.textContent = originalBtnText;
  }
});
