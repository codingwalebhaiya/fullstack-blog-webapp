import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PostForm from "../components/editor/PostForm";
import { postService } from "../services/postService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Toast from "../components/ui/Toast";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { user, updateToken } = useAuth();
  const navigate = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000);
  };

  const handleCreatePost = async (postData) => {
    if (!user) {
      showToast("Please log in to create a post");
      return;
    }

    setLoading(true);

    try {
      const result = await postService.createPost(postData);
      if (result.success) {
        showToast("Post created successfully!", "success");

        // Update token if user role changed
        if (result.data.token) {
          updateToken(result.data.token);
        }

        // Redirect to the new post or posts list
        setTimeout(() => {
          navigate(`/posts/${result.data.post.slug}/${result.data.post._id}`);
        }, 1500);
      } else {
        showToast(result.message || "Failed to create post");
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Post
            </h1>
            <p className="text-gray-600 mt-1">
              Share your thoughts and ideas with the world
            </p>
          </div>

          <PostForm
            onSubmit={handleCreatePost}
            submitButtonText="Create Post"
            isLoading={loading}
          />
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "" })}
      />
    </div>
  );
};

export default CreatePost;

