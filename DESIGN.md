# Design System: Monochrome

Dokumen ini adalah sumber kebenaran visual portofolio. Setiap perubahan UI wajib mengikuti aturan di bawah. Tema ditetapkan **monokrom**: hanya hitam, putih, dan abu-abu netral.

## 1. Aturan warna

1. **Hanya abu-abu netral.** Setiap warna harus memiliki nilai R = G = B (contoh `#565656`, `rgba(0, 0, 0, .1)`). Tidak ada hue apa pun, termasuk biru untuk link, hijau untuk sukses, atau merah untuk error.
2. **Gunakan token, bukan nilai mentah.** Komponen baru memakai variabel CSS di bawah. Nilai hex langsung hanya boleh dipakai di ilustrasi 3D yang butuh gradasi logam, dan tetap harus abu-abu.
3. **Status dibedakan tanpa warna.** Error ditandai ikon `!`, border 2px, dan teks pesan. Sukses ditandai teks. Ini sekaligus memenuhi WCAG 1.4.1 (warna bukan satu-satunya penanda).
4. **Gambar ikut monokrom.** Foto dan logo memakai `filter: grayscale(1)`.
5. **Aksen = kontras, bukan warna.** Elemen terpenting (CTA utama, tombol aktif) memakai kebalikan latar: teks terang di atas `--text-primary`.

## 2. Token

Nilai efektif (gabungan `style.css` dan override di `experience.css`).

| Token | Terang | Gelap | Kegunaan |
| --- | --- | --- | --- |
| `--bg-primary` | `#ffffff` | `#121212` | Latar halaman dan kartu |
| `--bg-secondary` | `#f6f6f6` | `#1a1a1a` | Latar ilustrasi, tag, panel |
| `--bg-tertiary` | `#f4f4f4` | `#242424` | Lapisan ketiga |
| `--text-primary` | `#202020` | `#efefef` | Judul, teks utama, CTA |
| `--text-secondary` | `#565656` | `#b8b8b8` | Paragraf |
| `--text-muted` | `#676767` | `#a1a1a1` | Label, metadata |
| `--border-color` | `#dedede` | `#363636` | Garis dekoratif |
| `--border-strong` | `#8c8c8c` | `#6c6c6c` | Batas kontrol form (≥ 3:1) |
| `--spatial-accent` | `#5e5e5e` | `#cacaca` | Titik dan orbit di adegan 3D |
| `--scene-paper` / `--scene-ink` | `#fff` / `#262626` | `#272727` / `#ebebeb` | Permukaan dan tinta ilustrasi |

Semua pasangan teks dan latar di atas lolos kontras WCAG AA (≥ 4.5:1 untuk teks normal).

## 3. Tipografi

- **Sans:** Inter, untuk keterbacaan UI dan judul geometris.
- **Mono:** JetBrains Mono, hanya untuk label teknis dan potongan kode.
- **Ukuran minimum:**
  - Teks yang dibaca (paragraf, tombol, link, tag): **≥ 12px**, paragraf utama **≥ 14px**.
  - Label dekoratif dengan `aria-hidden="true"` di dalam ilustrasi: **≥ 9px**.
- **Panjang baris:** paragraf maksimal ~70 karakter (`max-width: 62ch`); heading pendek memakai `text-wrap: balance`.
- **Hierarki heading:** berurutan `h1 → h2 → h3`, tanpa melompati level.

## 4. Interaksi dan form

- **Area sentuh:** kontrol utama (tab, filter, tombol) minimal **44×44px**; link di dalam paragraf cukup ≥ 24px (WCAG 2.5.8).
- **Kolom wajib** ditandai `*` beserta catatan teks, bukan dengan warna.
- **Validasi** dijalankan saat kolom ditinggalkan (blur) dan saat submit. Pesan error ditaruh di bawah kolom, menjelaskan cara memperbaikinya, dan dihubungkan lewat `aria-describedby` hanya selama error tampil.
- **Saat mengirim**, tombol dinonaktifkan, labelnya berubah, dan diberi `aria-busy="true"`.

## 5. Bentuk, bayangan, gerak

- **Radius:** 6–10px untuk kontrol, 14–16px untuk kartu, dan pill hanya untuk tombol filter dan Resume.
- **Bayangan:** hanya penanda elevasi (navbar saat scroll, ilustrasi 3D). Kartu biasa tetap datar dengan border.
- **Gerak:** animasi berulang hanya ada di ilustrasi dan wajib:
  - berhenti saat tidak terlihat di layar,
  - mengikuti `prefers-reduced-motion`,
  - bisa dijeda lewat tombol "Jeda animasi" (WCAG 2.2.2).

## 6. Checklist sebelum merge

- [ ] Tidak ada warna dengan hue (cek: R = G = B).
- [ ] Teks yang dibaca ≥ 12px, paragraf ≥ 14px.
- [ ] Tampilan benar di mode terang, gelap, dan lebar 375px tanpa scroll horizontal.
- [ ] Semua kontrol bisa dioperasikan dengan keyboard dan punya fokus terlihat.
- [ ] Audit axe-core (WCAG 2.2 AA) tanpa pelanggaran.
