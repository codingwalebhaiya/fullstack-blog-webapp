// src/pages/AdminPostList.jsx
import { useEffect, useState } from "react";
import API from "../../utils/api";
import useAuth from "../../hooks/useAuth";

export default function AdminPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      const response = await API.delete(`/api/v1/posts/${postId}`);
      if (response.status === 200) {
        // Remove the deleted post from state
        setPosts(posts.filter((post) => post._id !== postId));
      }

      return {
        success: true,
        data: response.data,
        message: "Post deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete post",
        error: error.response?.data,
      };
    }
  };

  useEffect(() => {
    setError(null);
    setLoading(true);

    try {
      const fetchPosts = async () => {
        const res = await API.get("/api/v1/posts");

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
      <h2 className="text-xl font-semibold mb-4 text-white">All Posts</h2>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="text-white bg-yellow-600">
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
                <td className="px-4 py-3 text-white">{idx + 1}</td>
                <td className="px-4 py-3 text-white">{p.title}</td>
                <td className="px-4 py-3 text-white">
                  {p.author?.username || p.author}
                </td>
                <td className="px-4 py-3 text-white">
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
                    <button
                      onClick={() => deletePost(p._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {posts.map((p, idx) => (
          <div
            key={p._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3
                className="font-semibold text-white text-lg truncate flex-1 mr-2"
                title={p.title}
              >
                {p.title}
              </h3>
              <span className="text-white bg-yellow-600 px-2 py-1 rounded text-sm whitespace-nowrap">
                #{idx + 1}
              </span>
            </div>

            <div className="text-gray-300 text-sm space-y-1 mb-3">
              <div className="flex justify-between">
                <span>Author:</span>
                <span>{p.author?.username || p.author}</span>
              </div>
              <div className="flex justify-between">
                <span>Published:</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <a
                href={`/posts/${p.slug}/${p._id}`}
                className="flex-1 text-center text-blue-600 hover:underline py-1 text-sm"
              >
                View
              </a>
              <a
                href={`/edit/${p._id}`}
                className="flex-1 text-center text-green-600 hover:underline py-1 text-sm"
              >
                Edit
              </a>
              <button
                onClick={() => deletePost(p._id)}
                className="flex-1 text-center text-red-600 hover:underline py-1 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-8">No posts found</div>
        )}
      </div>
    </div>
  );
}
