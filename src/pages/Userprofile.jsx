import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./UserProfile.css";

export default function UserProfile({ userId, user, navigate }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = user.id === userId;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      setProfile(profileData);

      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false });
      setPosts(postsData || []);

      const { count: fCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);
      setFollowerCount(fCount || 0);

      const { count: fgCount } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);
      setFollowingCount(fgCount || 0);

      if (!isOwnProfile) {
        const { data: followData } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", user.id)
          .eq("following_id", userId)
          .maybeSingle();
        setIsFollowing(!!followData);
      }

      setLoading(false);
    };

    fetchAll();
  }, [userId, user.id, isOwnProfile]);

  const handleFollow = async () => {
    if (isOwnProfile) return;
    setFollowLoading(true);
    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", userId);
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: userId, status: "accepted" });
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
    setFollowLoading(false);
  };

  if (loading) {
    return (
      <div className="userprofile-page">
        <div className="userprofile-loading">Loading…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="userprofile-page">
        <button className="userprofile-back" onClick={() => navigate("#/feed")}>← Back</button>
        <p>User tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="userprofile-page">
      <button className="userprofile-back" onClick={() => history.back()}>← Back</button>

      <div className="userprofile-header">
        <div className="userprofile-avatar">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} />
          ) : (
            <span>{profile.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="userprofile-info">
          <h1 className="userprofile-name">{profile.username}</h1>

          <div className="userprofile-stats">
            <div className="stat-item">
              <span className="stat-num">{posts.length}</span>
              <span className="stat-label">Flashes</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{followerCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              className={`follow-btn ${isFollowing ? "following" : ""}`}
              onClick={handleFollow}
              disabled={followLoading}
            >
              {followLoading ? "…" : isFollowing ? "Following ✓" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="userprofile-grid">
        {posts.length === 0 ? (
          <p className="userprofile-empty">No flashes in the last 24 hours.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="userprofile-thumb">
              <img src={post.image_url} alt={post.caption || "flash"} />
              {post.caption && (
                <div className="userprofile-thumb-caption">
                  <p>{post.caption}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}