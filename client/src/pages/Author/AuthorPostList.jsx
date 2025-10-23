
import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import useAuth from "../../hooks/useAuth";

export default function AuthorPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    setError(null);
    setLoading(true);

    try {
      const fetchPosts = async () => {
        const res = await API.get("/api/v1/posts/author/me");
        console.log(res);
        
        setPosts(res.data.posts || []);
      };

      fetchPosts();
    } catch (error) {
      setError(error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="p-4">Loading posts...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Posts</h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Published</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p, idx) => (
              <tr
                key={p._id}
                className="border-t border-gray-100 dark:border-gray-700"
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3">{p.author?.username || p.author}</td>
                <td className="px-4 py-3">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a
                      href={`/posts/${p.slug}/${p._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={`/edit/${p._id}`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Edit
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
