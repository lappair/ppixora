import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Top.css";

export default function Top({ navigate }) {
  const [topHashtags, setTopHashtags] = useState([]);
  const [topFlashes, setTopFlashes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);

      // Fetch posts 24 jam terakhir
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .gte("created_at", cutoff);

      if (error) { console.error("Gagal fetch posts:", error); setLoading(false); return; }
      if (!posts || posts.length === 0) { setLoading(false); return; }

      const postIds = posts.map((p) => p.id);

      // Fetch semua likes
      const { data: likesData } = await supabase
        .from("likes")
        .select("photo_id")
        .in("photo_id", postIds);

      // Hitung like per post
      const likeCounts = {};
      if (likesData) {
        likesData.forEach((l) => {
          likeCounts[l.photo_id] = (likeCounts[l.photo_id] || 0) + 1;
        });
      }

      // Sort posts by likes → top 6
      const sorted = posts
        .map((p) => ({
          id: p.id,
          image: p.image_url,
          caption: p.caption,
          authorName: p.author_name,
          avatar: p.avatar_url,
          likeCount: likeCounts[p.id] || 0,
        }))
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, 6);

      setTopFlashes(sorted);

      // Hitung hashtag dari caption semua posts
      const hashtagCounts = {};
      posts.forEach((post) => {
        if (post.caption) {
          const tags = post.caption.match(/#[\w]+/g) || [];
          tags.forEach((tag) => {
            const lowerTag = tag.toLowerCase();
            hashtagCounts[lowerTag] = (hashtagCounts[lowerTag] || 0) + 1;
          });
        }
      });

      const sortedTags = Object.entries(hashtagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopHashtags(sortedTags);
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
        <section className="top-section">
          <h2 className="section-title">Top Hashtags</h2>
          {topHashtags.length === 0 ? (
            <div className="top-empty">No hashtags trending yet.</div>
          ) : (
            <div className="hashtag-list">
              {topHashtags.map((h, i) => (
                <div key={i} className="hashtag-card" onClick={() => navigate(`#/hashtag/${h.tag.replace("#", "")}`)}>
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
        <section className="top-section">
          <h2 className="section-title">Top Flashes</h2>
          {topFlashes.length === 0 ? (
            <div className="top-empty">No flashes available yet.</div>
          ) : (
            <div className="top-grid">
              {topFlashes.map((post) => (
                <div
                  key={post.id}
                  className="top-flash-card"
                  onClick={() => navigate("#/feed")}
                >
                  <img src={post.image} alt={post.caption || "Flash"} />
                  <div className="top-flash-overlay">
                    <span className="top-flash-author">{post.authorName}</span>
                    <span className="top-flash-likes">♥ {post.likeCount}</span>
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