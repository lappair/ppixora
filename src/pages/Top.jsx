import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Top.css";

export default function Top({ navigate }) {
  const [topHashtags, setTopHashtags] = useState([]);
  const [topFlashes, setTopFlashes] = useState([]);
  const [topFollowed, setTopFollowed] = useState([]);
  const [topCommenters, setTopCommenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);

      const [
        { data: flashes, error: e1 },
        { data: hashtags, error: e2 },
        { data: followed, error: e3 },
        { data: commenters, error: e4 },
      ] = await Promise.all([
        supabase.from("top_flashes").select("*"),
        supabase.from("top_hashtags").select("*"),
        supabase.from("top_followed").select("*"),
        supabase.from("top_commenters").select("*"),
      ]);

      if (e1) console.error("top_flashes:", e1);
      if (e2) console.error("top_hashtags:", e2);
      if (e3) console.error("top_followed:", e3);
      if (e4) console.error("top_commenters:", e4);

      setTopFlashes(flashes || []);
      setTopHashtags(hashtags || []);
      setTopFollowed(followed || []);
      setTopCommenters(commenters || []);
      setLoading(false);
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="top-page">
        <div className="top-empty">Loading trending…</div>
      </div>
    );
  }

  return (
    <div className="top-page">
      <header className="top-header">
        <h1 className="top-title">Trending</h1>
        <p className="top-subtitle">Discover popular hashtags and top flashes.</p>
      </header>

      <div className="top-content">

        {/* Top Hashtags */}
        <section className="top-section top-hashtags-section">
          <h2 className="section-title">Top Hashtags</h2>
          {topHashtags.length === 0 ? (
            <div className="top-empty">No hashtags trending yet.</div>
          ) : (
            <div className="hashtag-list">
              {topHashtags.map((h, i) => (
                <div
                  key={i}
                  className="hashtag-card"
                  onClick={() => navigate(`#/hashtag/${h.tag.replace("#", "")}`)}
                >
                  <span className="hashtag-rank">{i + 1}</span>
                  <div className="hashtag-info">
                    <h3>{h.tag}</h3>
                    <p>{h.count} {h.count === 1 ? "flash" : "flashes"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Top Flashes */}
        <section className="top-section top-flashes-section">
          <h2 className="section-title">Top Flashes</h2>
          {topFlashes.length === 0 ? (
            <div className="top-empty">No flashes available yet.</div>
          ) : (
            <div className="top-grid">
              {topFlashes.map((post, i) => (
                <div
                  key={post.id}
                  className="top-flash-card"
                  onClick={() => navigate(`#/user/${post.user_id}`)}
                >
                  <span className="top-flash-rank">{i + 1}</span>
                  <img src={post.image_url} alt={post.caption || "Flash"} />
                  <div className="top-flash-overlay">
                    <span className="top-flash-author">{post.author_name}</span>
                    <span className="top-flash-likes">♥ {post.like_count} · 💬 {post.comment_count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Most Followed */}
        <section className="top-section top-followed-section">
          <h2 className="section-title">Most Followed</h2>
          {topFollowed.length === 0 ? (
            <div className="top-empty">No follow data yet.</div>
          ) : (
            <div className="top-users-list">
              {topFollowed.map((u, i) => (
                <div
                  key={u.id}
                  className="top-user-card"
                  onClick={() => navigate(`#/user/${u.id}`)}
                >
                  <span className="top-user-rank">{i + 1}</span>
                  <div className="top-user-avatar">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.username} />
                    ) : (
                      <span>{u.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="top-user-info">
                    <p className="top-user-name">{u.username}</p>
                    <p className="top-user-stat">{u.follow_count} followers</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Most Active */}
        <section className="top-section top-active-section">
          <h2 className="section-title">Most Active</h2>
          {topCommenters.length === 0 ? (
            <div className="top-empty">No comment data yet.</div>
          ) : (
            <div className="top-users-list">
              {topCommenters.map((u, i) => (
                <div
                  key={u.id}
                  className="top-user-card"
                  onClick={() => navigate(`#/user/${u.id}`)}
                >
                  <span className="top-user-rank">{i + 1}</span>
                  <div className="top-user-avatar">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.username} />
                    ) : (
                      <span>{u.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="top-user-info">
                    <p className="top-user-name">{u.username}</p>
                    <p className="top-user-stat">{u.comment_count} comments today</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
