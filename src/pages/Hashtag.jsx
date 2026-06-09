import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./hashtag.css";

function captionHasTag(caption, selectedTag) {
  const hashtags = caption?.match(/#[\p{L}\p{N}_]+/gu) || [];
  return hashtags.some(
    (hashtag) => hashtag.slice(1).toLocaleLowerCase() === selectedTag.toLocaleLowerCase()
  );
}

export default function Hashtag({ tag, navigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHashtagPosts = async () => {
      setLoading(true);
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .gte("created_at", cutoff)
        .ilike("caption", `%#${tag}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal fetch hashtag posts:", error);
      } else {
        setPosts(
          data
            .filter((p) => captionHasTag(p.caption, tag))
            .map((p) => ({
              id: p.id,
              image: p.image_url,
              caption: p.caption,
              authorName: p.author_name,
              avatar: p.avatar_url,
              createdAt: new Date(p.created_at).getTime(),
            }))
        );
      }
      setLoading(false);
    };

    fetchHashtagPosts();
  }, [tag]);

  if (loading) {
    return (
      <div className="hashtag-page">
        <div className="hashtag-empty">Loading…</div>
      </div>
    );
  }

  return (
    <div className="hashtag-page">
      <header className="hashtag-header">
        <button className="hashtag-back" onClick={() => navigate("#/top")}>
          ← Back
        </button>
        <h1 className="hashtag-title">#{tag}</h1>
        <p className="hashtag-sub">{posts.length} {posts.length === 1 ? "flash" : "flashes"} in the last 24h</p>
        <p className="hashtag-order">Newest flashes first</p>
      </header>

      {posts.length === 0 ? (
        <div className="hashtag-empty">No flashes with #{tag} yet.</div>
      ) : (
        <div className="hashtag-grid">
          {posts.map((post) => (
            <div key={post.id} className="hashtag-card">
              <div className="hashtag-card-img">
                <img src={post.image} alt={post.caption || "flash"} />
              </div>
              <div className="hashtag-card-meta">
                <div className="hashtag-card-author">
                  <div className="hashtag-avatar">
                    {post.avatar ? (
                      <img src={post.avatar} alt={post.authorName} />
                    ) : (
                      <span>{post.authorName?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span>{post.authorName}</span>
                </div>
                {post.caption && (
                  <p className="hashtag-card-caption">{post.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
