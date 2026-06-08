import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Feed.css";

function timeLeft(createdAt) {
  const ms = 24 * 60 * 60 * 1000 - (Date.now() - createdAt);
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function expiryPercent(createdAt) {
  const elapsed = Date.now() - createdAt;
  return Math.min((elapsed / (24 * 60 * 60 * 1000)) * 100, 100);
}

export default function Feed({ posts, setPosts, user, navigate }) {
  const [now, setNow] = useState(Date.now());
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal fetch posts:", error);
      } else {
      setPosts(
        data.map((p) => ({
          id: p.id,
          image: p.image_url,
          caption: p.caption,
          authorName: p.author_name,
          avatar: p.avatar_url,
          userId: p.user_id, // ← tambah ini
          createdAt: new Date(p.created_at).getTime() + (7 * 60 * 60 * 1000),
        }))
      );

        const postIds = data.map((p) => p.id);
        if (postIds.length > 0) {
          const { data: likesData } = await supabase
            .from("likes")
            .select("*")
            .in("photo_id", postIds);

          if (likesData) {
            const likesMap = {};
            postIds.forEach((id) => {
              const postLikes = likesData.filter((l) => l.photo_id === id);
              likesMap[id] = {
                count: postLikes.length,
                liked: postLikes.some((l) => l.user_id === user.id),
              };
            });
            setLikes(likesMap);
          }

          const { data: commentsData } = await supabase
            .from("comments")
            .select("*")
            .in("photo_id", postIds)
            .order("created_at", { ascending: true });

          if (commentsData) {
            const commMap = {};
            postIds.forEach(id => {
              commMap[id] = commentsData.filter(c => c.photo_id === id);
            });
            setComments(commMap);
          }
        }
      }
      setLoading(false);
    };

    fetchPosts();
  }, [setPosts, user.id]);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      setPosts((prev) =>
        prev.filter((p) => Date.now() - p.createdAt < 24 * 60 * 60 * 1000)
      );
    }, 60_000);
    return () => clearInterval(id);
  }, [setPosts]);

  const livePosts = posts.filter(
    (p) => now - p.createdAt < 24 * 60 * 60 * 1000
  );

  const handleDelete = async (id, imageUrl) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { console.error("Gagal hapus:", error); return; }

    const fileName = imageUrl.split("/flashes/")[1];
    if (fileName) {
      await supabase.storage.from("flashes").remove([fileName]);
    }

    setPosts((prev) => prev.filter((p) => p.id !== id));
    setConfirmId(null);
  };

  const handleLike = async (postId) => {
    const current = likes[postId] || { count: 0, liked: false };
    if (current.liked) {
      await supabase.from("likes").delete()
        .eq("photo_id", postId)
        .eq("user_id", user.id);
      setLikes((prev) => ({
        ...prev,
        [postId]: { count: prev[postId].count - 1, liked: false },
      }));
    } else {
      await supabase.from("likes").insert({
        photo_id: postId,
        user_name: user.name,
        user_id: user.id, // ← tambah ini
      });
      setLikes((prev) => ({
        ...prev,
        [postId]: { count: (prev[postId]?.count || 0) + 1, liked: true },
      }));
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        photo_id: postId,
        user_name: user.name,
        comment_text: newComment,
        user_id: user.id, // ← tambah ini
      })
      .select()
      .single();

    if (!error && data) {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }));
      setNewComment("");
    } else {
      console.error("Gagal kirim komentar:", error);
    }
  };

  const inner = (
    <div className="feed-page">
      <header className="feed-header">
        <h1 className="feed-title">Today's <em>flashes</em></h1>
      </header>

      {loading ? (
        <div className="feed-empty">
          <span className="empty-icon">◈</span>
          <p>Loading flashes…</p>
        </div>
      ) : livePosts.length === 0 ? (
        <div className="feed-empty">
          <span className="empty-icon">◈</span>
          <p>Nothing here yet.</p>
          <button className="btn-primary" onClick={() => navigate("#/upload")}>
            Post the first flash
          </button>
        </div>
      ) : (
        <div className="post-grid">
          {[...livePosts].map((post) => {
            const pct = expiryPercent(post.createdAt);
            const urgent = pct > 85;
            const isOwner = post.authorName === user.name;
            const isConfirming = confirmId === post.id;
            const postLikes = likes[post.id] || { count: 0, liked: false };
            const postComments = comments[post.id] || [];

            return (
              <article key={post.id} className="post-card">
                <div className="post-image-wrap">
                  <img src={post.image} alt={post.caption || "flash"} className="post-image" />
                  {isOwner && (
                    <div className="post-delete-wrap">
                      {isConfirming ? (
                        <div className="delete-confirm">
                          <span>Hapus post ini?</span>
                          <button className="delete-confirm-yes" onClick={() => handleDelete(post.id, post.image)}>Ya</button>
                          <button className="delete-confirm-no" onClick={() => setConfirmId(null)}>Batal</button>
                        </div>
                      ) : (
                        <button className="delete-btn" onClick={() => setConfirmId(post.id)} title="Hapus post">✕</button>
                      )}
                    </div>
                  )}
                </div>

                <div className="post-meta">
                  <div className="post-author">
                    <div className="post-avatar">
                      {post.avatar ? (
                        <img src={post.avatar} alt={post.authorName} />
                      ) : (
                        <span>{post.authorName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="post-author-name">{post.authorName}</span>
                  </div>

                  <div className="post-actions">
                    <button className={`like-btn ${postLikes.liked ? "liked" : ""}`} onClick={() => handleLike(post.id)}>
                      <span className="like-icon">{postLikes.liked ? "♥" : "♡"}</span>
                      <span className="like-count">{postLikes.count}</span>
                    </button>

                    <button className="comment-btn" onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}>
                      <span>💬</span>
                      <span className="comment-count">{postComments.length}</span>
                    </button>

                    <div className={`post-timer ${urgent ? "urgent" : ""}`}>
                      <div className="timer-bar-track">
                        <div className="timer-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="timer-label">{timeLeft(post.createdAt)}</span>
                    </div>
                  </div>
                </div> {/* tutup post-meta */}

                {post.caption && (
                  <div className="post-caption">
                    <p>{post.caption}</p>
                  </div>
                )}
                {activeCommentId === post.id && (
                  <div className="comment-section">
                    <div className="comment-list">
                      {postComments.length === 0 ? (
                        <p className="no-comments">Belum ada komentar.</p>
                      ) : (
                        postComments.map((c) => (
                          <div key={c.id} className="comment-item">
                            <strong>{c.user_name || "User"}:</strong> {c.comment_text}
                          </div>
                        ))
                      )}
                    </div>
                    <div className="comment-input-wrap">
                      <input
                        type="text"
                        placeholder="Tambahkan komentar..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                        className="comment-input"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment.trim()}
                        className="comment-send-btn"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="feed-wrapper">
      {/* Background full width */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-dots dots-1" />
      <div className="bg-dots dots-2" />
      <div className="bg-circle" />
      {inner}
    </div>
  );
}