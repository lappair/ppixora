import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import "./Upload.css";

export default function Upload({ user, setPosts, navigate }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onInputChange = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Upload foto ke Supabase Storage
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("flashes")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Ambil public URL foto
      const { data: urlData } = supabase.storage
        .from("flashes")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // 3. Simpan post ke tabel posts
      const { data: newPost, error: insertError } = await supabase
        .from("posts")
        .insert({
          image_url: imageUrl,
          caption: caption.trim(),
          author_name: user.name,
          avatar_url: user.avatar,
          user_id: user.id, // ← tambah ini
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Update state lokal
      setPosts((prev) => [
        ...prev,
        {
          id: newPost.id,
          image: newPost.image_url,
          caption: newPost.caption,
          authorName: newPost.author_name,
          avatar: newPost.avatar_url,
          createdAt: new Date(newPost.created_at).getTime(),
        },
      ]);

      navigate("#/feed");
    } catch (err) {
      console.error(err);
      setError("Gagal upload, coba lagi.");
      setSubmitting(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFile(null);
    setCaption("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="upload-page">
      <header className="upload-header">
        <h1 className="upload-title">New <em>flash</em></h1>
        <p className="upload-sub">Disappears in 24 hours.</p>
      </header>

      <div className="upload-body">
        {!preview ? (
          <div
            className={`drop-zone ${dragging ? "dragging" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="file-input"
              onChange={onInputChange}
            />
            <div className="drop-icon">◈</div>
            <p className="drop-primary">Drop an image here</p>
            <p className="drop-secondary">or click to browse</p>
            <span className="drop-badge">JPG · PNG · WEBP · GIF</span>
          </div>
        ) : (
          <div className="preview-wrap">
            <img src={preview} alt="preview" className="preview-img" />
            <button className="clear-btn" onClick={clearImage} title="Remove">
              ✕
            </button>
          </div>
        )}

        <div className="caption-field">
          <label className="caption-label">Caption</label>
          <textarea
            className="caption-input"
            placeholder="Say something… (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            rows={3}
          />
          <span className="caption-count">{caption.length} / 200</span>
        </div>

        {error && <p className="upload-error">{error}</p>}

        <div className="upload-actions">
          <button className="btn-ghost" onClick={() => navigate("#/feed")}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!file || submitting}
          >
            {submitting ? "Uploading…" : "Post flash ◈"}
          </button>
        </div>
      </div>
    </div>
  );
}