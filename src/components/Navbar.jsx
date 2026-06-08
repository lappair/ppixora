import "./Navbar.css";

export default function Navbar({ currentHash, navigate, user, onLogout }) {
  const links = [
    { hash: "#/feed", label: "Feed" },
    { hash: "#/top", label: "Top" }, 
    { hash: "#/upload", label: "Post" },
  ];

  return (
    <nav className="navbar">
      <button className="navbar-logo" onClick={() => navigate("#/feed")}>
        <span className="logo-icon">◈</span>
        <span className="logo-text">Pixora</span>
      </button>

      <div className="navbar-links">
        {links.map((l) => (
          <button
            key={l.hash}
            className={`nav-link ${currentHash === l.hash ? "active" : ""}`}
            onClick={() => navigate(l.hash)}
          >
            {l.label}
          </button>
        ))}
      </div>
        
      <div className="navbar-right">
        <button className="navbar-avatar" onClick={() => navigate("#/profile")}>
          <span className="navbar-username">{user.name}</span>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span className="avatar-initials">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}