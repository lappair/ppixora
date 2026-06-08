# Pixora

Pixora adalah aplikasi web berbagi foto berbasis React yang memungkinkan pengguna mengunggah momen singkat dalam bentuk "flash". Setiap flash hanya ditampilkan selama 24 jam, sehingga aplikasi terasa seperti media sosial yang fokus pada momen harian, cepat, ringan, dan sementara.

Project ini dibuat dengan Vite + React untuk sisi frontend dan Supabase untuk backend, autentikasi, database, serta penyimpanan gambar. Secara konsep, Pixora menggabungkan fitur feed foto, upload gambar, like, komentar, hashtag, trending post, dan manajemen profil pengguna.

## Ringkasan Project

Pixora dirancang sebagai platform sosial sederhana tempat pengguna dapat:

- Membuat akun dan login.
- Mengunggah gambar sebagai flash.
- Menambahkan caption pada gambar.
- Melihat flash pengguna lain pada feed utama.
- Memberikan like pada flash.
- Memberikan komentar pada flash.
- Melihat sisa waktu flash sebelum hilang dari feed.
- Menghapus flash milik sendiri.
- Mengubah nama tampilan dan avatar profil.
- Melihat hashtag populer dan flash terpopuler dalam 24 jam terakhir.

Konsep utama dari aplikasi ini adalah ephemeral content, yaitu konten yang memiliki masa aktif terbatas. Pada Pixora, konten hanya dianggap aktif selama 24 jam sejak waktu upload.

## Tujuan Project

Tujuan pengembangan Pixora adalah membuat aplikasi web interaktif yang dapat menunjukkan penerapan:

- Single Page Application menggunakan React.
- Routing sederhana berbasis URL hash.
- Autentikasi pengguna menggunakan Supabase Auth.
- Operasi CRUD pada database Supabase.
- Upload dan penyajian gambar melalui Supabase Storage.
- State management menggunakan React Hooks.
- Pengolahan data frontend untuk fitur like, komentar, hashtag, dan trending.
- Desain antarmuka modern yang responsif dan mudah digunakan.

## Teknologi yang Digunakan

| Teknologi | Fungsi |
| --- | --- |
| React | Library utama untuk membangun antarmuka pengguna |
| Vite | Build tool dan development server |
| Supabase Auth | Sistem login dan registrasi pengguna |
| Supabase Database | Penyimpanan data profil, post, like, dan komentar |
| Supabase Storage | Penyimpanan gambar flash dan avatar |
| CSS Modules per halaman | Styling halaman dan komponen |
| ESLint | Pemeriksaan kualitas kode JavaScript/React |

## Fitur Utama

### 1. Autentikasi Pengguna

Pixora memiliki fitur registrasi dan login berbasis email dan password. Proses autentikasi menggunakan Supabase Auth.

File terkait:

- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/App.jsx`
- `src/supabaseClient.js`

Alur autentikasi:

1. Pengguna melakukan registrasi dengan email, username, dan password.
2. Data akun dibuat melalui Supabase Auth.
3. Username disimpan ke tabel `profiles`.
4. Setelah login, aplikasi mengambil session aktif melalui `supabase.auth.getSession()`.
5. Jika session valid, pengguna dapat mengakses halaman utama aplikasi.
6. Jika belum login, pengguna diarahkan ke halaman login.

### 2. Feed Flash

Feed adalah halaman utama yang menampilkan flash dari seluruh pengguna. Data post diambil dari tabel `posts` dan hanya post dalam 24 jam terakhir yang ditampilkan.

File terkait:

- `src/pages/Feed.jsx`
- `src/pages/Feed.css`

Fungsi utama feed:

- Mengambil post dari Supabase.
- Memfilter post yang masih aktif dalam 24 jam.
- Menampilkan gambar, caption, avatar, dan nama pengguna.
- Menampilkan timer sisa waktu.
- Menampilkan jumlah like dan komentar.
- Mengizinkan pemilik post menghapus post miliknya.

### 3. Upload Flash

Halaman upload memungkinkan pengguna mengunggah gambar baru dan menambahkan caption opsional.

File terkait:

- `src/pages/Upload.jsx`
- `src/pages/Upload.css`

Alur upload:

1. Pengguna memilih atau drag-and-drop file gambar.
2. Aplikasi membuat preview gambar.
3. Pengguna dapat menambahkan caption maksimal 200 karakter.
4. Gambar diupload ke Supabase Storage bucket `flashes`.
5. Public URL gambar disimpan ke tabel `posts`.
6. Setelah berhasil, pengguna diarahkan kembali ke feed.

Format gambar yang didukung oleh UI:

- JPG
- PNG
- WEBP
- GIF

### 4. Like Flash

Setiap pengguna dapat memberikan like pada flash. Status like disimpan pada tabel `likes`.

File terkait:

- `src/pages/Feed.jsx`

Cara kerja:

- Saat feed dimuat, aplikasi mengambil seluruh like untuk post yang sedang tampil.
- Jika pengguna belum like, klik tombol like akan menambah data ke tabel `likes`.
- Jika pengguna sudah like, klik ulang akan menghapus data like tersebut.
- Jumlah like diperbarui pada state lokal agar UI terasa responsif.

### 5. Komentar

Pengguna dapat menambahkan komentar pada setiap flash. Komentar disimpan pada tabel `comments`.

File terkait:

- `src/pages/Feed.jsx`

Fitur komentar:

- Membuka dan menutup panel komentar per post.
- Menampilkan daftar komentar.
- Menambahkan komentar baru.
- Mengirim komentar dengan tombol atau tombol Enter.
- Menyimpan nama pengguna dan ID pengguna pada data komentar.

### 6. Profil Pengguna

Halaman profil digunakan untuk mengubah display name dan avatar.

File terkait:

- `src/pages/Profile.jsx`
- `src/pages/Profile.css`

Fitur profil:

- Menampilkan nama dan avatar pengguna.
- Mengubah display name.
- Mengupload avatar baru ke Supabase Storage bucket `avatars`.
- Menghapus avatar dari tampilan profil.
- Menampilkan daftar flash milik pengguna.
- Memperbarui nama pengguna pada post dan komentar milik pengguna.

### 7. Trending dan Top Flash

Halaman Trending menampilkan hashtag populer dan flash dengan jumlah like tertinggi dalam 24 jam terakhir.

File terkait:

- `src/pages/Top.jsx`
- `src/pages/Top.css`

Fitur halaman Trending:

- Mengambil post 24 jam terakhir.
- Menghitung jumlah like per post.
- Mengurutkan post berdasarkan jumlah like.
- Menampilkan 6 flash teratas.
- Mengekstrak hashtag dari caption.
- Menampilkan 5 hashtag terpopuler.

### 8. Halaman Hashtag

Halaman hashtag menampilkan semua flash yang mengandung hashtag tertentu.

File terkait:

- `src/pages/Hashtag.jsx`
- `src/pages/hashtag.css`

Alur:

1. Pengguna memilih hashtag dari halaman Trending.
2. Aplikasi membuka route `#/hashtag/:tag`.
3. Aplikasi mencari post dengan caption yang mengandung hashtag tersebut.
4. Hanya post dalam 24 jam terakhir yang ditampilkan.

## Struktur Folder

```text
ppixora/
|-- public/
|   |-- favicon.svg
|   `-- icons.svg
|-- src/
|   |-- assets/
|   |   |-- hero.png
|   |   |-- react.svg
|   |   `-- vite.svg
|   |-- components/
|   |   |-- Navbar.jsx
|   |   `-- Navbar.css
|   |-- pages/
|   |   |-- Feed.jsx
|   |   |-- Feed.css
|   |   |-- Hashtag.jsx
|   |   |-- hashtag.css
|   |   |-- Login.jsx
|   |   |-- Login.css
|   |   |-- Profile.jsx
|   |   |-- Profile.css
|   |   |-- Register.jsx
|   |   |-- Top.jsx
|   |   |-- Top.css
|   |   |-- Upload.jsx
|   |   `-- Upload.css
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   |-- main.jsx
|   `-- supabaseClient.js
|-- index.html
|-- package.json
|-- package-lock.json
|-- vite.config.js
`-- eslint.config.js
```

## Arsitektur Aplikasi

Pixora menggunakan arsitektur frontend SPA. Seluruh halaman dikelola oleh React, sedangkan perpindahan halaman menggunakan hash route dari browser.

Route yang tersedia:

| Route | Halaman | Fungsi |
| --- | --- | --- |
| `#/feed` | Feed | Menampilkan flash aktif |
| `#/upload` | Upload | Mengunggah flash baru |
| `#/profile` | Profile | Mengelola profil pengguna |
| `#/top` | Top | Melihat hashtag dan flash populer |
| `#/hashtag/:tag` | Hashtag | Melihat flash berdasarkan hashtag |
| `#/register` | Register | Registrasi akun baru |

Komponen utama aplikasi berada di `src/App.jsx`. File ini bertanggung jawab untuk:

- Mengecek session login.
- Mengambil profil pengguna dari Supabase.
- Menyimpan state user, profile, post, dan route aktif.
- Menentukan halaman yang ditampilkan.
- Menangani logout.
- Mengirim props penting ke setiap halaman.

## Desain Database Supabase

Project ini menggunakan beberapa tabel utama.

### Tabel `profiles`

Tabel ini menyimpan data profil pengguna.

| Kolom | Tipe Data | Keterangan |
| --- | --- | --- |
| `id` | uuid | ID pengguna dari Supabase Auth |
| `username` | text | Nama tampilan pengguna |
| `avatar_url` | text | URL avatar pengguna |

### Tabel `posts`

Tabel ini menyimpan data flash yang diupload pengguna.

| Kolom | Tipe Data | Keterangan |
| --- | --- | --- |
| `id` | uuid/int | ID post |
| `image_url` | text | URL gambar dari Supabase Storage |
| `caption` | text | Caption post |
| `author_name` | text | Nama pembuat post |
| `avatar_url` | text | Avatar pembuat post |
| `user_id` | uuid | ID pembuat post |
| `created_at` | timestamp | Waktu post dibuat |

### Tabel `likes`

Tabel ini menyimpan data like pada flash.

| Kolom | Tipe Data | Keterangan |
| --- | --- | --- |
| `id` | uuid/int | ID like |
| `photo_id` | uuid/int | ID post yang disukai |
| `user_id` | uuid | ID pengguna yang melakukan like |
| `user_name` | text | Nama pengguna yang melakukan like |

### Tabel `comments`

Tabel ini menyimpan komentar pada flash.

| Kolom | Tipe Data | Keterangan |
| --- | --- | --- |
| `id` | uuid/int | ID komentar |
| `photo_id` | uuid/int | ID post yang dikomentari |
| `user_id` | uuid | ID pengguna yang berkomentar |
| `user_name` | text | Nama pengguna yang berkomentar |
| `comment_text` | text | Isi komentar |
| `created_at` | timestamp | Waktu komentar dibuat |

## Supabase Storage

Project ini menggunakan dua bucket storage.

| Bucket | Fungsi |
| --- | --- |
| `flashes` | Menyimpan gambar post/flash |
| `avatars` | Menyimpan gambar avatar profil |

Gambar yang sudah diupload diambil melalui public URL agar dapat langsung ditampilkan pada komponen React.

## Alur Data Aplikasi

```text
Pengguna login/register
        |
        v
Supabase Auth membuat atau membaca session
        |
        v
App.jsx mengambil data profil dari tabel profiles
        |
        v
Pengguna masuk ke halaman Feed
        |
        v
Feed mengambil posts, likes, dan comments dari Supabase
        |
        v
Pengguna dapat upload, like, komentar, buka trending, atau edit profil
```

## Instalasi dan Menjalankan Project

Pastikan Node.js dan npm sudah terpasang.

Clone repository:

```bash
git clone https://github.com/lappair/ppixora.git
cd ppixora
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build untuk production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Lint kode:

```bash
npm run lint
```

## Konfigurasi Supabase

Koneksi Supabase berada pada file:

```text
src/supabaseClient.js
```

File tersebut membuat client Supabase menggunakan:

- Supabase Project URL
- Supabase anon public key

Untuk pengembangan lanjutan, konfigurasi ini dapat dipindahkan ke environment variable agar lebih fleksibel, misalnya:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Kemudian dipanggil melalui `import.meta.env` di aplikasi React.

## Penjelasan Alur Demo untuk Presentasi

Berikut urutan demo yang dapat digunakan saat memaparkan project ke dosen.

### 1. Perkenalan Aplikasi

Jelaskan bahwa Pixora adalah aplikasi berbagi foto sementara. Setiap post disebut flash dan hanya aktif selama 24 jam.

Poin yang dapat disampaikan:

- Aplikasi berbasis web.
- Pengguna harus login terlebih dahulu.
- Konten bersifat sementara.
- Ada interaksi sosial seperti like dan komentar.
- Ada fitur trending berdasarkan hashtag dan jumlah like.

### 2. Demo Registrasi dan Login

Tunjukkan halaman register dan login.

Poin teknis:

- Register menggunakan Supabase Auth.
- Username disimpan pada tabel `profiles`.
- Session login dicek di `App.jsx`.
- Jika belum login, pengguna tidak dapat masuk ke feed.

### 3. Demo Feed

Tunjukkan halaman feed.

Poin teknis:

- Data diambil dari tabel `posts`.
- Feed hanya menampilkan post dalam 24 jam terakhir.
- Timer menunjukkan sisa waktu flash.
- Post lama otomatis tidak tampil karena difilter berdasarkan `created_at`.

### 4. Demo Upload Flash

Tunjukkan proses upload gambar.

Poin teknis:

- File gambar dipilih dari komputer.
- Aplikasi menampilkan preview.
- File diupload ke Supabase Storage bucket `flashes`.
- URL gambar disimpan ke tabel `posts`.
- Setelah upload berhasil, pengguna diarahkan ke feed.

### 5. Demo Like dan Komentar

Tunjukkan tombol like dan panel komentar.

Poin teknis:

- Like disimpan pada tabel `likes`.
- Komentar disimpan pada tabel `comments`.
- State lokal diperbarui agar perubahan langsung terlihat.
- Setiap like dan komentar terhubung dengan ID pengguna.

### 6. Demo Trending

Tunjukkan halaman Top.

Poin teknis:

- Aplikasi mengambil post dalam 24 jam terakhir.
- Jumlah like dihitung per post.
- Hashtag diekstrak dari caption menggunakan pencarian pola `#tag`.
- Top hashtag dan top flash ditampilkan berdasarkan popularitas.

### 7. Demo Profil

Tunjukkan halaman profil.

Poin teknis:

- Pengguna dapat mengubah display name.
- Avatar dapat diupload ke bucket `avatars`.
- Nama pengguna pada post dan komentar ikut diperbarui.
- Halaman profil juga menampilkan daftar flash milik pengguna.

## Kelebihan Project

- Menggunakan backend-as-a-service sehingga pengembangan lebih cepat.
- Sudah memiliki autentikasi pengguna.
- Mendukung upload gambar secara langsung.
- Memiliki konsep konten 24 jam yang jelas.
- Memiliki fitur sosial dasar: feed, like, komentar, profil, dan trending.
- Struktur kode mudah dipahami karena dipisahkan berdasarkan halaman dan komponen.

## Batasan Project

Beberapa batasan yang masih dapat dikembangkan:

- Routing masih menggunakan hash route sederhana, belum memakai React Router.
- Konfigurasi Supabase masih ditulis langsung di kode.
- Penghapusan post menghapus data post dan file gambar, tetapi belum membersihkan like dan komentar terkait secara eksplisit.
- Belum ada pagination atau infinite scroll pada feed.
- Belum ada fitur follow pengguna.
- Belum ada notifikasi real-time.
- Belum ada validasi ukuran file gambar pada sisi frontend.

## Pengembangan Selanjutnya

Fitur yang dapat ditambahkan pada versi berikutnya:

- React Router untuk routing yang lebih rapi.
- Environment variable untuk konfigurasi Supabase.
- Realtime update menggunakan Supabase Realtime.
- Sistem follow/follower.
- Halaman detail post.
- Moderasi komentar.
- Pagination feed.
- Optimasi gambar sebelum upload.
- Dark mode.
- Unit test dan integration test.

## Kesimpulan

Pixora adalah aplikasi web sosial berbasis React dan Supabase yang menerapkan konsep berbagi foto sementara selama 24 jam. Project ini menunjukkan penerapan autentikasi, database, storage, state management, routing sederhana, dan interaksi pengguna dalam satu aplikasi yang utuh.

Dengan fitur feed, upload, like, komentar, profil, hashtag, dan trending, Pixora dapat digunakan sebagai contoh project frontend-backend modern yang cocok untuk dipresentasikan sebagai hasil pengembangan aplikasi web interaktif.
