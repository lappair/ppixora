import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Top from "./pages/Top";
import Hashtag from "./pages/Hashtag";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

const ROUTES = {
  "#/feed": Feed,
  "#/upload": Upload,
  "#/profile": Profile,
  "#/top": Top,
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || "#/feed");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 5000)
      );
      const query = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const { data, error } = await Promise.race([query, timeout]);
      console.log("profile data:", data, "error:", error);
      if (data) setProfile(data);
    } catch (e) {
      console.error("fetchProfile error:", e);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (e) {
        console.error("Auth error:", e);
      } finally {
        setAuthLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = () => setHash(window.location.hash || "#/feed");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (route) => {
    window.location.hash = route;
    setHash(route);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate("#/feed");
  };

  if (authLoading) {
    return (
      <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh" }}>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>Loading…</span>
      </div>
    );
  }

  if (!user) {
    if (hash === "#/register") return <Register navigate={navigate} />;
    return <Login navigate={navigate} />;
  }

  const appUser = {
    id: user.id,
    name: profile?.username || user.email,
    avatar: profile?.avatar_url || null,
  };

  // Dynamic route: #/user/:id
  if (hash.startsWith("#/user/")) {
    const userId = hash.replace("#/user/", "");
    return (
      <div className="app-shell">
        <Navbar currentHash={hash} navigate={navigate} user={appUser} onLogout={handleLogout} />
        <main className="app-main">
          <UserProfile userId={userId} user={appUser} navigate={navigate} />
        </main>
      </div>
    );
  }

  // Dynamic route: #/hashtag/:tag
  if (hash.startsWith("#/hashtag/")) {
    const tag = hash.replace("#/hashtag/", "");
    return (
      <div className="app-shell">
        <Navbar currentHash={hash} navigate={navigate} user={appUser} onLogout={handleLogout} />
        <main className="app-main">
          <Hashtag tag={tag} navigate={navigate} user={appUser} />
        </main>
      </div>
    );
  }

  const Page = ROUTES[hash] || Feed;

  return (
    <div className="app-shell">
      <Navbar currentHash={hash} navigate={navigate} user={appUser} onLogout={handleLogout} />
      <main className="app-main">
        {hash === "#/top" ? (
          <Top navigate={navigate} />
        ) : (
          <Page
            user={appUser}
            setUser={setProfile}
            posts={posts}
            setPosts={setPosts}
            navigate={navigate}
          />
        )}
      </main>
    </div>
  );
}