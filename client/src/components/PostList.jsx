
import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import API from "../utils/api.js"; // Assuming this utility is correct

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await API.get("/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.error || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


     if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading Posts...</p>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg shadow-md">
          Error: {error}
        </div>
      </div>
    );

  
  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-xl font-medium text-gray-500">No posts available.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 px-4 sm:px-6 hidden">
          Latest Posts
        </h1>

        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default PostList;
