import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import useAuth from "../hooks/useAuth.js";

const CreatePost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    // e.target.files is a FileList, we only care about the first file
    setPostImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.content || !postImage) {
      setError("All fields and an image are required.");
      setLoading(false);
      return;
    }

    //Create FormData
    // This object is necessary to send both files and text fields
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);

    // Append the file with the KEY matching the Multer setup
    //'image' MUST match the key used in upload.single('image') on the server side
    formData.append("image", postImage);

    try {
      // Axios automatically sets the required 'Content-Type: multipart/form-data'
      // when it detects a FormData object.

      const res = await API.post("/posts", formData);
      console.log(res);
      const id = res.data.post?._id || res.data.post?.id;
      const slug = res.data.post?.slug;
      localStorage.setItem("token", token);

      if (res.ok) {
        alert("Post created successfully");
        console.log("Post created successfully!", res.data);
        // Check if the server sent a new token, and update it
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          console.log("Role updated to author. New token stored.");
        }
      }
      setForm({ title: "", content: "" });
      setPostImage(null);
      if (id) {
        navigate(`/posts/${slug}/${id}`);
      } else navigate("/post");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-xl font-semibold text-gray-600">
          Submitting & Uploading...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg shadow-md">
          Error: {error}
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create Post</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleTextChange}
            placeholder="Enter title"
            disabled={loading}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleTextChange}
            rows="10"
            disabled={loading}
            required
            placeholder="Write your post content..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Post Image</label>
          <div className="upload-overlay">
            <input
              type="file"
              name="postImage"
              id="postImage"
              accept="image/*" // Restrict to image files
              onChange={handleImageChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {/* {loading ? "Submitting & Uploading..." : "Publish"} */}
            Publish
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

export default CreatePost;
