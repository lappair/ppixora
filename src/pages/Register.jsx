import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Login.css";

export default function Register({ navigate }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Daftar ke Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Simpan username ke tabel profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, username });

    if (profileError) {
      setError("Username sudah dipakai atau tidak valid.");
      setLoading(false);
      return;
    }

    // Berhasil — App.jsx akan otomatis redirect karena onAuthStateChange
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left — Branding */}
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo-icon">◈</span>
          <span className="auth-logo-text">Pixora</span>
        </div>
        <h1 className="auth-tagline">Join the<br /><em>Community</em></h1>
        <p className="auth-desc">Buat akun dan mulai berbagi flash-mu dengan dunia.</p>
        <div className="auth-blobs">
          <div className="auth-blob b1" />
          <div className="auth-blob b2" />
          <div className="auth-blob b3" />
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-sub">Sign up to get started.</p>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <span className="auth-field-icon">✉</span>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <span className="auth-field-icon">👤</span>
              <input
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={30}
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <span className="auth-field-icon">🔒</span>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Loading…" : "SIGN UP"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={() => navigate("#/feed")}>Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}