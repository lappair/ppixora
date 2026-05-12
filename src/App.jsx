import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Top from "./pages/Top";
import Hashtag from "./pages/Hashtag";
import "./App.css";

const ROUTES = {
  "#/feed": Feed,
  "#/upload": Upload,
  "#/profile": Profile,
  "#/top": Top,
};

export default function App() {
  const [hash, setHash] = useState(window.location.hash || "#/feed");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("flash_user");
    return saved ? JSON.parse(saved) : { name: "Anonymous", avatar: null };
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const handler = () => setHash(window.location.hash || "#/feed");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("flash_user", JSON.stringify(user));
    } catch (e) {
      console.warn("localStorage penuh");
    }
  }, [user]);

  const navigate = (route) => {
    window.location.hash = route;
    setHash(route);
  };

  // Dynamic route: #/hashtag/kacau
  if (hash.startsWith("#/hashtag/")) {
    const tag = hash.replace("#/hashtag/", "");
    return (
      <div className="app-shell">
        <Navbar currentHash={hash} navigate={navigate} user={user} />
        <main className="app-main">
          <Hashtag tag={tag} navigate={navigate} user={user} />
        </main>
      </div>
    );
  }

  const Page = ROUTES[hash] || Feed;

  return (
    <div className="app-shell">
      <Navbar currentHash={hash} navigate={navigate} user={user} />
      <main className="app-main">
        {hash === "#/top" ? (
          <Top navigate={navigate} />
        ) : (
          <Page
            user={user}
            setUser={setUser}
            posts={posts}
            setPosts={setPosts}
            navigate={navigate}
          />
        )}
      </main>
    </div>
  );
}