// src/pages/CreatePost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";

const EditPost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setError(null);
  };


  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
      };
      const res = await API.post("/posts", payload);
      const id = res.data.post?._id || res.data.post?.id;
      const slug = res.data.post?.slug;
      alert("Post created successfully.");
      setForm({ title: "", content: "" });
      if (id) navigate(`/posts/${slug}/${id}`);
      else navigate("/posts");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading Post...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create Post</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows="10"
            placeholder="Write your post content..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>

          <button
            type="button"
            onClick={() => setForm({ title: "", content: "" })}
            className="px-4 py-2 border rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
