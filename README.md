# Portofolio Muhammad Zidhan Fadillah

Portofolio statis dengan desain monokrom, adegan CSS 3D interaktif, dan layout responsif. Dapat langsung dihosting di GitHub Pages tanpa build atau dependency JavaScript tambahan.

## Jalankan lokal

```sh
python -m http.server 4173
```

Buka `http://localhost:4173`.

## Struktur

- `DESIGN.md`: design system monokrom (token warna, tipografi, aturan gerak) yang wajib diikuti setiap perubahan UI.
- `index.html`: profil, proyek, pengalaman, kontak, dan komposisi 3D.
- `style.css`: gaya dasar, komponen, tema, dan aksesibilitas.
- `experience.css`: desain spasial, ilustrasi proyek, dan breakpoint responsif.
- `app.js`: tema tersimpan, menu mobile, tab proyek, validasi form, dan scroll reveal.
- `experience.js`: interaksi 3D berbasis pointer, pilihan tech stack, filter proyek, progres scroll, dan kontrol gerakan.

## Interaksi

- Gerakkan pointer pada komposisi hero untuk melihat perspektifnya berubah. Pada layar sentuh, gunakan tombol Frontend, Backend, dan Database untuk menjelajahi lapisan.
- Gunakan filter Semua, Produk, atau Fullstack untuk memilih proyek.
- Tab detail proyek mendukung tombol panah, Home, dan End. Menu mobile dapat ditutup dengan Escape.
- Pilihan tema dan jeda animasi tersimpan di perangkat. Pengaturan sistem `prefers-reduced-motion` otomatis menonaktifkan gerakan. Efek pointer hanya aktif pada perangkat dengan pointer presisi dan dukungan hover.
- Ilustrasi di kartu proyek adalah visual konsep, bukan screenshot antarmuka produk.

## Kontak dan deployment

Form memakai endpoint Formspree yang sudah ada di repositori. Pastikan endpoint tersebut masih aktif ketika menerbitkan. Uji lokal menggunakan respons tiruan agar tidak mengirim pesan sungguhan.

Untuk GitHub Pages, publikasikan isi root repositori termasuk kedua file `experience.*`, foto profil, dan PDF resume. Semua aset lokal memakai URL relatif sehingga tetap bekerja pada subpath `/Portofolio-Pribadi/`.
