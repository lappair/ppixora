import { useState } from "react";
import { supabase } from "../supabaseClient";
import "./Login.css";


export default function Login({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email atau password salah.");
    }
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

        <div className="auth-left-content">
          <h1 className="auth-tagline">Share Your Story<br />With <em>Pixora</em></h1>
          <p className="auth-desc">Berbagi cerita, pengalaman, dan passion-mu dengan dunia.</p>

        </div>

        <div className="auth-blobs">
          <div className="auth-blob b1" />
          <div className="auth-blob b2" />
          <div className="auth-blob b3" />
        </div>
      </div>

      {/* Right — Form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-form-title">Welcome Back!</h2>
          <p className="auth-form-sub">Login to continue to your account.</p>

          <form className="auth-form" onSubmit={handleLogin}>
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
              <span className="auth-field-icon">🔒</span>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Loading…" : "LOGIN"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button onClick={() => navigate("#/register")}>Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}