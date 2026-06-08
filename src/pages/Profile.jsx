import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import "./Profile.css";

export default function Profile({ user, setUser, posts, navigate }) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef();

  const myPosts = posts.filter((p) => p.userId === user.id);

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setAvatar(URL.createObjectURL(file));
    fileRef._pendingFile = file;
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    let avatarUrl = avatar;

    try {
      // Upload avatar kalau ada foto baru
      if (fileRef._pendingFile) {
        const file = fileRef._pendingFile;
        const fileName = `avatar-${Date.now()}-${file.name.replace(/\s/g, "_")}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = urlData.publicUrl;
        fileRef._pendingFile = null;
      }

      // Update tabel profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username: name.trim(), avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update author_name di semua post milik user ini
      await supabase
        .from("posts")
        .update({ author_name: name.trim() })
        .eq("user_id", user.id);
        
      await supabase
        .from("comments")
        .update({ user_name: name.trim() })
        .eq("user_id", user.id);
      // Update state lokal
      setUser({ id: user.id, username: name.trim(), avatar_url: avatarUrl });
      setAvatar(avatarUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Gagal simpan, coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    fileRef._pendingFile = null;
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">Your <em>profile</em></h1>
      </header>

      <div className="profile-card">
        <div className="avatar-section">
          <div className="avatar-lg">
            {avatar ? (
              <img src={avatar} alt={name} />
            ) : (
              <span>{name.charAt(0).toUpperCase()}</span>
            )}
            <button
              className="avatar-edit-btn"
              onClick={() => fileRef.current?.click()}
              title="Change photo"
            >
              ✎
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarFile}
          />
          <div className="avatar-actions">
            <button
              className="btn-ghost"
              style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => fileRef.current?.click()}
            >
              Change photo
            </button>
            {avatar && (
              <button className="remove-avatar-btn" onClick={removeAvatar}>
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Display name</label>
          <input
            className="field-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="Your name"
          />
        </div>

        {error && <p className="profile-error">{error}</p>}

        <div className="profile-save-row">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!name.trim() || saving || saved}
          >
            {saving ? "Menyimpan…" : saved ? "✓ Saved!" : "Save changes"}
          </button>
        </div>
      </div>

      <section className="my-posts-section">
        <h2 className="my-posts-title">
          Your flashes
          <span className="posts-count">{myPosts.length}</span>
        </h2>
        {myPosts.length === 0 ? (
          <div className="no-posts">
            <p>You haven't posted anything yet.</p>
            <button className="btn-primary" onClick={() => navigate("#/upload")}>
              Post your first flash
            </button>
          </div>
        ) : (
          <div className="my-posts-grid">
            {[...myPosts].reverse().map((post) => (
              <div key={post.id} className="my-post-thumb">
                <img src={post.image} alt="flash" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}