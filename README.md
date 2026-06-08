# Pixora

Pixora adalah platform media sosial berbasis photo sharing yang memungkinkan pengguna mengunggah foto, menulis caption, menggunakan hashtag, memberi like, menulis komentar, dan melihat konten yang sedang populer. Dalam implementasi kode React yang ada, foto disebut sebagai "flash" karena kontennya dibuat aktif dalam rentang 24 jam.

Project ini dikembangkan menggunakan Vite + React pada sisi frontend dan Supabase sebagai layanan backend untuk autentikasi, database, serta penyimpanan gambar. Dari sisi studi kasus basis data, Pixora dimodelkan sebagai sistem media sosial relasional yang harus mampu mengelola pengguna, foto, follow, hashtag, like, komentar, dan story.

## Studi Kasus

Berdasarkan studi kasus "Platform Media Sosial Pixora" pada variasi photo sharing, Pixora dibuat sebagai aplikasi berbagi foto tempat pengguna dapat mengekspresikan kreativitas melalui gambar. Setiap pengguna dapat mengunggah foto dengan caption, memakai hashtag agar kontennya mudah ditemukan, saling mengikuti, memberi like, menulis komentar, serta melihat story yang otomatis hilang setelah 24 jam.

Ekosistem Pixora berpusat pada interaksi antarpengguna. Feed menampilkan konten dari pengguna lain, hashtag membantu proses pencarian dan discovery, sedangkan like dan komentar menjadi indikator engagement. Dalam rancangan basis data, sistem perlu menyimpan hubungan antarentitas secara jelas agar data dapat dianalisis dengan query relasional.

Penekanan utama studi kasus:

- Pengguna dapat membuat akun dan memiliki profil.
- Pengguna dapat mengunggah foto dengan caption.
- Foto dapat memiliki banyak hashtag.
- Satu hashtag dapat digunakan oleh banyak foto.
- Pengguna dapat mengikuti pengguna lain.
- Pengguna dapat memberi like pada foto.
- Pengguna dapat mengomentari foto.
- Story atau flash memiliki batas waktu 24 jam.
- Sistem dapat menghitung popularitas pengguna, hashtag, foto, dan aktivitas komentar.

Sistem basis data harus mampu menjawab pertanyaan seperti: siapa yang paling banyak diikuti, hashtag mana yang paling tren, foto mana yang mendapat engagement tertinggi, hingga pengguna aktif yang sering berkomentar. Semua ini dikelola dalam delapan tabel relasional.

## Tujuan Project

Tujuan project Pixora adalah membangun aplikasi media sosial sederhana yang memperlihatkan hubungan antara frontend interaktif dan rancangan basis data relasional.

Secara teknis, project ini menunjukkan:

- Pembuatan Single Page Application menggunakan React.
- Autentikasi pengguna menggunakan Supabase Auth.
- Upload gambar ke Supabase Storage.
- Operasi insert, select, update, dan delete pada database.
- Pengelolaan state menggunakan React Hooks.
- Perhitungan data engagement seperti like, komentar, top flash, dan hashtag.
- Pemodelan studi kasus media sosial ke dalam tabel relasional.

## Teknologi yang Digunakan

| Teknologi | Fungsi |
| --- | --- |
| React | Membangun antarmuka pengguna berbasis komponen |
| Vite | Development server dan build tool |
| Supabase Auth | Registrasi, login, session, dan logout |
| Supabase Database | Penyimpanan data profil, post, like, dan komentar |
| Supabase Storage | Penyimpanan gambar flash dan avatar |
| CSS | Styling per halaman dan komponen |
| ESLint | Pemeriksaan kualitas kode |

## Sistematika Kode

Kode Pixora disusun berdasarkan pemisahan tanggung jawab. File utama mengatur autentikasi, routing, dan state global, sedangkan folder `pages` berisi fitur utama aplikasi.

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

### `src/main.jsx`

File ini menjadi entry point React. Komponen `App` dirender ke elemen root pada `index.html`.

### `src/App.jsx`

`App.jsx` adalah pusat kendali aplikasi. File ini menangani:

- Pemeriksaan session login melalui `supabase.auth.getSession()`.
- Listener perubahan autentikasi melalui `supabase.auth.onAuthStateChange()`.
- Pengambilan profil pengguna dari tabel `profiles`.
- Penyimpanan state `user`, `profile`, `posts`, dan `hash`.
- Routing sederhana berbasis URL hash.
- Logout pengguna.
- Pengiriman props ke halaman seperti `Feed`, `Upload`, `Profile`, `Top`, dan `Hashtag`.

Route yang dikelola:

| Route | Komponen | Fungsi |
| --- | --- | --- |
| `#/feed` | `Feed.jsx` | Menampilkan flash aktif |
| `#/upload` | `Upload.jsx` | Mengunggah flash baru |
| `#/profile` | `Profile.jsx` | Mengelola profil pengguna |
| `#/top` | `Top.jsx` | Menampilkan trending hashtag dan top flash |
| `#/hashtag/:tag` | `Hashtag.jsx` | Menampilkan flash berdasarkan hashtag |
| `#/register` | `Register.jsx` | Registrasi akun |

### `src/supabaseClient.js`

File ini membuat koneksi ke Supabase menggunakan Supabase URL dan anon key. Semua operasi auth, database, dan storage memakai client dari file ini.

### `src/components/Navbar.jsx`

Navbar berfungsi sebagai navigasi utama setelah pengguna login. Komponen ini menyediakan akses ke Feed, Top, Upload, Profile, dan Logout.

### Folder `src/pages`

Folder ini berisi halaman utama aplikasi:

| File | Peran |
| --- | --- |
| `Login.jsx` | Login pengguna dengan email dan password |
| `Register.jsx` | Registrasi pengguna dan penyimpanan username |
| `Feed.jsx` | Menampilkan post 24 jam terakhir, like, komentar, timer, dan hapus post |
| `Upload.jsx` | Upload gambar ke bucket `flashes` dan insert data ke tabel `posts` |
| `Profile.jsx` | Edit display name, avatar, dan melihat flash milik user |
| `Top.jsx` | Menghitung top hashtag dan top flash |
| `Hashtag.jsx` | Menampilkan post berdasarkan hashtag tertentu |

## Alur Kerja Aplikasi

```text
Pengguna membuka Pixora
        |
        v
App.jsx mengecek session Supabase
        |
        +-- Belum login --> Login / Register
        |
        +-- Sudah login --> Ambil profile dari tabel profiles
                              |
                              v
                        Tampilkan aplikasi utama
                              |
                              v
        Feed / Upload / Profile / Top / Hashtag
```

## Alur Fitur Berdasarkan Kode

### 1. Registrasi

File utama: `src/pages/Register.jsx`

Alur:

1. Pengguna memasukkan email, username, dan password.
2. Aplikasi memanggil `supabase.auth.signUp()`.
3. Jika akun berhasil dibuat, ID user dari Supabase Auth disimpan ke tabel `profiles`.
4. Username disimpan agar dapat ditampilkan sebagai identitas pengguna.

### 2. Login

File utama: `src/pages/Login.jsx`

Alur:

1. Pengguna memasukkan email dan password.
2. Aplikasi memanggil `supabase.auth.signInWithPassword()`.
3. Jika berhasil, session aktif terbaca oleh `App.jsx`.
4. Pengguna masuk ke halaman feed.

### 3. Feed Flash

File utama: `src/pages/Feed.jsx`

Alur:

1. Aplikasi mengambil data dari tabel `posts`.
2. Data difilter menggunakan batas waktu 24 jam terakhir.
3. Untuk setiap post, aplikasi mengambil data like dari tabel `likes`.
4. Aplikasi juga mengambil komentar dari tabel `comments`.
5. UI menampilkan gambar, caption, author, avatar, timer, like, dan komentar.

Pada kode, konsep story 24 jam diterapkan dengan filter:

```text
created_at >= waktu sekarang - 24 jam
```

Kemudian state lokal juga diperbarui berkala agar post yang sudah lewat 24 jam tidak lagi tampil.

### 4. Upload Flash

File utama: `src/pages/Upload.jsx`

Alur:

1. Pengguna memilih file gambar.
2. Aplikasi membuat preview.
3. Gambar diupload ke Supabase Storage bucket `flashes`.
4. Public URL gambar diambil.
5. Data post disimpan ke tabel `posts`.
6. Pengguna diarahkan kembali ke feed.

Data yang disimpan:

- URL gambar.
- Caption.
- Nama author.
- Avatar author.
- ID user pembuat post.
- Waktu upload.

### 5. Like

File utama: `src/pages/Feed.jsx`

Alur:

1. Jika user belum like, aplikasi insert data ke tabel `likes`.
2. Jika user sudah like, aplikasi delete data dari tabel `likes`.
3. Jumlah like pada UI diperbarui melalui state lokal.

Relasi yang dipakai:

```text
user -> likes -> post
```

### 6. Komentar

File utama: `src/pages/Feed.jsx`

Alur:

1. Pengguna membuka panel komentar.
2. Pengguna menulis komentar.
3. Aplikasi insert komentar ke tabel `comments`.
4. Komentar baru ditambahkan ke state agar langsung muncul di UI.

Relasi yang dipakai:

```text
user -> comments -> post
```

### 7. Profil

File utama: `src/pages/Profile.jsx`

Alur:

1. Pengguna mengubah display name atau avatar.
2. Avatar baru diupload ke bucket `avatars`.
3. Tabel `profiles` diperbarui.
4. Nama author pada `posts` dan `comments` milik user ikut diperbarui.
5. Halaman profil menampilkan flash milik pengguna berdasarkan `user_id`.

### 8. Trending

File utama: `src/pages/Top.jsx`

Alur:

1. Aplikasi mengambil post 24 jam terakhir.
2. Aplikasi mengambil semua like untuk post tersebut.
3. Jumlah like dihitung per post.
4. Post diurutkan berdasarkan jumlah like.
5. Caption dipindai untuk menemukan hashtag.
6. Hashtag dihitung berdasarkan frekuensi pemakaian.

Pada implementasi kode saat ini, hashtag belum disimpan sebagai tabel fisik. Hashtag diekstrak langsung dari teks caption menggunakan pola `#tag`.

### 9. Halaman Hashtag

File utama: `src/pages/Hashtag.jsx`

Alur:

1. Pengguna memilih hashtag dari halaman Top.
2. Aplikasi membuka route `#/hashtag/:tag`.
3. Query Supabase mencari caption yang mengandung hashtag tersebut.
4. Hanya post 24 jam terakhir yang ditampilkan.

## Desain Basis Data Studi Kasus

Untuk kebutuhan studi kasus basis data relasional, Pixora dapat dimodelkan ke dalam delapan tabel utama. Delapan tabel ini digunakan untuk menjawab kebutuhan analitik media sosial seperti pengguna paling populer, hashtag paling tren, foto dengan engagement tertinggi, dan pengguna paling aktif berkomentar.

### 1. `users`

Menyimpan identitas pengguna.

| Kolom | Keterangan |
| --- | --- |
| `user_id` | Primary key pengguna |
| `email` | Email pengguna |
| `username` | Nama tampilan |
| `avatar_url` | Foto profil |
| `is_private` | Status akun privat atau publik |
| `created_at` | Waktu akun dibuat |

Pada kode saat ini, tabel ini direpresentasikan oleh Supabase Auth dan tabel `profiles`.

### 2. `photos`

Menyimpan foto yang diunggah pengguna.

| Kolom | Keterangan |
| --- | --- |
| `photo_id` | Primary key foto |
| `user_id` | Foreign key ke `users` |
| `image_url` | URL gambar |
| `caption` | Caption foto |
| `location_name` | Lokasi foto, jika ada |
| `created_at` | Waktu upload |

Pada kode saat ini, tabel ini direpresentasikan oleh tabel `posts`.

### 3. `follows`

Menyimpan relasi pengikut antar pengguna.

| Kolom | Keterangan |
| --- | --- |
| `follow_id` | Primary key follow |
| `follower_id` | User yang mengikuti |
| `following_id` | User yang diikuti |
| `status` | Status follow, misalnya pending atau accepted |
| `created_at` | Waktu follow dibuat |

Tabel ini penting untuk menjawab pertanyaan siapa pengguna yang paling banyak diikuti.

### 4. `hashtags`

Menyimpan daftar hashtag unik.

| Kolom | Keterangan |
| --- | --- |
| `hashtag_id` | Primary key hashtag |
| `name` | Nama hashtag, contoh `travel` |
| `created_at` | Waktu hashtag pertama dibuat |

Tabel ini membuat hashtag lebih terstruktur dibanding hanya membaca teks caption.

### 5. `photo_hashtags`

Tabel penghubung many-to-many antara foto dan hashtag.

| Kolom | Keterangan |
| --- | --- |
| `photo_id` | Foreign key ke `photos` |
| `hashtag_id` | Foreign key ke `hashtags` |

Relasi ini diperlukan karena satu foto dapat memiliki banyak hashtag, dan satu hashtag dapat digunakan oleh banyak foto.

### 6. `likes`

Menyimpan interaksi like pada foto.

| Kolom | Keterangan |
| --- | --- |
| `like_id` | Primary key like |
| `photo_id` | Foreign key ke `photos` |
| `user_id` | Foreign key ke `users` |
| `created_at` | Waktu like diberikan |

Tabel ini dipakai untuk menghitung popularitas dan engagement foto.

### 7. `comments`

Menyimpan komentar pengguna pada foto.

| Kolom | Keterangan |
| --- | --- |
| `comment_id` | Primary key komentar |
| `photo_id` | Foreign key ke `photos` |
| `user_id` | Foreign key ke `users` |
| `comment_text` | Isi komentar |
| `created_at` | Waktu komentar dibuat |

Tabel ini dipakai untuk menghitung aktivitas diskusi dan pengguna yang sering berkomentar.

### 8. `stories`

Menyimpan konten sementara yang hilang setelah 24 jam.

| Kolom | Keterangan |
| --- | --- |
| `story_id` | Primary key story |
| `user_id` | Foreign key ke `users` |
| `image_url` | URL gambar story |
| `caption` | Caption story |
| `created_at` | Waktu story dibuat |
| `expires_at` | Waktu story berakhir |

Pada kode saat ini, konsep story diwakili oleh flash/post yang difilter hanya untuk 24 jam terakhir.

## Relasi Antar Tabel

```text
users 1--n photos
users 1--n stories
users 1--n likes
users 1--n comments
users 1--n follows sebagai follower
users 1--n follows sebagai following
photos 1--n likes
photos 1--n comments
photos n--n hashtags melalui photo_hashtags
```

Secara konsep, `users` menjadi entitas pusat. Foto, story, like, komentar, dan follow semuanya terhubung ke pengguna. Hashtag dipisahkan ke tabel sendiri agar pencarian tren dapat dilakukan lebih efisien dan tidak bergantung pada parsing caption di frontend.

## Pertanyaan Analitik yang Dijawab Database

Bagian ini adalah inti dari studi kasus basis data. Dengan delapan tabel relasional, sistem dapat menjawab pertanyaan-pertanyaan penting berikut.

### 1. Siapa pengguna yang paling banyak diikuti?

Pertanyaan ini dijawab dengan tabel `follows`.

```sql
SELECT
  u.user_id,
  u.username,
  COUNT(f.follower_id) AS jumlah_pengikut
FROM users u
JOIN follows f ON f.following_id = u.user_id
WHERE f.status = 'accepted'
GROUP BY u.user_id, u.username
ORDER BY jumlah_pengikut DESC
LIMIT 1;
```

Makna query:

- `following_id` adalah user yang sedang diikuti.
- Jumlah baris pada `follows` menunjukkan jumlah pengikut.
- User dengan count terbesar adalah pengguna paling populer berdasarkan follower.

### 2. Hashtag mana yang paling tren?

Pertanyaan ini dijawab dengan tabel `hashtags`, `photo_hashtags`, dan `photos`.

```sql
SELECT
  h.name,
  COUNT(ph.photo_id) AS jumlah_pemakaian
FROM hashtags h
JOIN photo_hashtags ph ON ph.hashtag_id = h.hashtag_id
JOIN photos p ON p.photo_id = ph.photo_id
WHERE p.created_at >= NOW() - INTERVAL '24 hours'
GROUP BY h.hashtag_id, h.name
ORDER BY jumlah_pemakaian DESC
LIMIT 5;
```

Makna query:

- Hashtag dihitung berdasarkan jumlah foto yang memakainya.
- Filter 24 jam membuat hasilnya relevan sebagai tren terbaru.
- Query ini adalah versi basis data dari fitur Top Hashtags pada `Top.jsx`.

### 3. Foto mana yang mendapat engagement tertinggi?

Engagement dapat dihitung dari gabungan jumlah like dan komentar.

```sql
SELECT
  p.photo_id,
  p.caption,
  u.username,
  COUNT(DISTINCT l.like_id) AS jumlah_like,
  COUNT(DISTINCT c.comment_id) AS jumlah_komentar,
  COUNT(DISTINCT l.like_id) + COUNT(DISTINCT c.comment_id) AS total_engagement
FROM photos p
JOIN users u ON u.user_id = p.user_id
LEFT JOIN likes l ON l.photo_id = p.photo_id
LEFT JOIN comments c ON c.photo_id = p.photo_id
GROUP BY p.photo_id, p.caption, u.username
ORDER BY total_engagement DESC
LIMIT 5;
```

Makna query:

- Like dan komentar sama-sama dianggap bentuk interaksi.
- Foto dengan total interaksi tertinggi dianggap memiliki engagement paling tinggi.
- Query ini sesuai dengan fitur Top Flashes pada `Top.jsx`, tetapi versi database lebih lengkap karena memasukkan komentar.

### 4. Siapa pengguna aktif yang sering berkomentar?

Pertanyaan ini dijawab menggunakan tabel `comments` dan `users`.

```sql
SELECT
  u.user_id,
  u.username,
  COUNT(c.comment_id) AS jumlah_komentar
FROM users u
JOIN comments c ON c.user_id = u.user_id
GROUP BY u.user_id, u.username
ORDER BY jumlah_komentar DESC
LIMIT 5;
```

Makna query:

- Aktivitas pengguna dapat diukur dari jumlah komentar.
- Pengguna dengan komentar terbanyak dapat dianggap sebagai user paling aktif dalam diskusi.

## Perbandingan Rancangan Studi Kasus dan Implementasi Kode

| Kebutuhan Studi Kasus | Tabel Ideal | Implementasi Kode Saat Ini |
| --- | --- | --- |
| Data pengguna | `users` | Supabase Auth + `profiles` |
| Foto pengguna | `photos` | `posts` |
| Follow pengguna | `follows` | Belum diimplementasikan di UI |
| Hashtag terstruktur | `hashtags` | Diekstrak dari caption di `Top.jsx` |
| Relasi foto-hashtag | `photo_hashtags` | Belum menjadi tabel fisik |
| Like foto | `likes` | Sudah digunakan di `Feed.jsx` |
| Komentar foto | `comments` | Sudah digunakan di `Feed.jsx` |
| Story 24 jam | `stories` | Diwakili oleh post/flash aktif 24 jam |

Dengan demikian, kode React yang ada sudah memperlihatkan fitur inti seperti autentikasi, upload, feed, like, komentar, profil, hashtag, dan trending. Untuk pemodelan basis data penuh sesuai studi kasus, struktur dapat diperluas menjadi delapan tabel relasional agar seluruh kebutuhan analitik dapat dijawab langsung melalui query SQL.

## Supabase Storage

Selain tabel relasional, Pixora memakai storage untuk menyimpan file gambar.

| Bucket | Fungsi |
| --- | --- |
| `flashes` | Menyimpan gambar post atau flash |
| `avatars` | Menyimpan gambar avatar pengguna |

Database hanya menyimpan URL gambar, sedangkan file gambar asli disimpan di Supabase Storage.

## Alur Penjelasan untuk Presentasi

Berikut alur yang disarankan saat memaparkan project ke dosen.

### 1. Mulai dari Studi Kasus

Jelaskan bahwa Pixora adalah platform photo sharing seperti media sosial sederhana. Pengguna dapat mengunggah foto, memakai hashtag, memberi like, berkomentar, dan melihat konten populer.

Tekankan bahwa project ini bukan hanya tampilan aplikasi, tetapi juga studi kasus basis data yang harus mampu mengelola relasi antar pengguna, konten, dan interaksi.

### 2. Jelaskan Kebutuhan Data

Sampaikan bahwa sistem harus menyimpan:

- Data pengguna.
- Data foto.
- Data follow.
- Data hashtag.
- Relasi foto dan hashtag.
- Data like.
- Data komentar.
- Data story 24 jam.

Delapan kebutuhan ini kemudian diterjemahkan menjadi delapan tabel relasional.

### 3. Jelaskan Relasi Tabel

Tekankan relasi utama:

- Satu user dapat mengunggah banyak foto.
- Satu user dapat mengikuti banyak user lain.
- Satu foto dapat memiliki banyak like.
- Satu foto dapat memiliki banyak komentar.
- Satu foto dapat memiliki banyak hashtag.
- Satu hashtag dapat dipakai banyak foto.
- Satu user dapat membuat banyak story.

### 4. Hubungkan Database dengan Pertanyaan Analitik

Bagian ini penting untuk menunjukkan manfaat basis data relasional.

Contoh pertanyaan:

- Siapa user paling populer? Dijawab dari tabel `follows`.
- Hashtag apa yang sedang tren? Dijawab dari `hashtags` dan `photo_hashtags`.
- Foto mana yang engagement-nya tertinggi? Dijawab dari `photos`, `likes`, dan `comments`.
- Siapa user paling aktif berkomentar? Dijawab dari `comments`.

### 5. Jelaskan Sistematika Kode

Setelah basis data dijelaskan, masuk ke kode:

- `App.jsx` mengatur session, route, dan state utama.
- `Login.jsx` dan `Register.jsx` mengatur autentikasi.
- `Feed.jsx` menampilkan post, like, komentar, dan timer.
- `Upload.jsx` mengatur upload gambar.
- `Profile.jsx` mengatur data profil.
- `Top.jsx` menghitung trending.
- `Hashtag.jsx` menampilkan konten berdasarkan hashtag.
- `Navbar.jsx` menyediakan navigasi.

### 6. Tunjukkan Demo Aplikasi

Urutan demo:

1. Register akun.
2. Login.
3. Upload foto.
4. Lihat foto muncul di feed.
5. Tambahkan like.
6. Tambahkan komentar.
7. Buka halaman Top untuk melihat trending.
8. Buka hashtag.
9. Ubah profil dan avatar.

### 7. Tutup dengan Kelebihan dan Pengembangan

Sampaikan bahwa aplikasi sudah memiliki alur dasar media sosial. Untuk pengembangan berikutnya, rancangan delapan tabel dapat diimplementasikan penuh agar fitur follow, hashtag terstruktur, dan story dapat dikelola lebih kuat di level database.

## Instalasi dan Menjalankan Project

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

Untuk pengembangan lanjutan, URL dan anon key Supabase sebaiknya dipindahkan ke environment variable:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Kemudian digunakan melalui `import.meta.env` agar konfigurasi tidak ditulis langsung di source code.

## Kelebihan Project

- Sudah menggunakan autentikasi pengguna.
- Sudah mendukung upload gambar.
- Sudah memiliki feed berbasis waktu 24 jam.
- Sudah memiliki interaksi sosial berupa like dan komentar.
- Sudah memiliki halaman trending dan hashtag.
- Struktur kode mudah dipahami karena dipisahkan berdasarkan halaman.
- Cocok dijadikan contoh hubungan antara aplikasi frontend dan rancangan basis data relasional.

## Batasan Project

- Routing masih menggunakan hash route sederhana.
- Fitur follow belum tersedia pada UI.
- Hashtag masih diekstrak dari caption, belum memakai tabel `hashtags` dan `photo_hashtags`.
- Konsep story masih digabung dengan post/flash 24 jam.
- Konfigurasi Supabase masih ditulis langsung di kode.
- Belum ada pagination pada feed.
- Belum ada notifikasi real-time.
- Belum ada validasi ukuran file gambar.

## Pengembangan Selanjutnya

- Mengimplementasikan tabel `follows`.
- Mengimplementasikan tabel `hashtags` dan `photo_hashtags`.
- Memisahkan `photos` dan `stories`.
- Menambahkan query ranking untuk popular user, trending hashtag, top engagement, dan active commenter.
- Menambahkan React Router.
- Menambahkan Supabase Realtime.
- Menambahkan pagination atau infinite scroll.
- Memindahkan konfigurasi Supabase ke environment variable.
- Menambahkan unit test dan integration test.

## Kesimpulan

Pixora adalah project media sosial photo sharing yang menggabungkan aplikasi React dengan rancangan basis data relasional. Dari sisi kode, aplikasi sudah menunjukkan alur utama seperti autentikasi, upload foto, feed, like, komentar, profil, hashtag, dan trending. Dari sisi studi kasus, Pixora dapat dimodelkan dalam delapan tabel relasional agar sistem mampu menjawab pertanyaan analitik seperti pengguna paling banyak diikuti, hashtag paling tren, foto dengan engagement tertinggi, dan pengguna paling aktif berkomentar.

Dengan demikian, Pixora tidak hanya menjadi aplikasi web interaktif, tetapi juga contoh studi kasus basis data yang memperlihatkan bagaimana relasi antar pengguna, konten, dan interaksi sosial dikelola secara sistematis.
