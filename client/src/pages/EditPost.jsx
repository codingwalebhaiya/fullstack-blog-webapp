import  { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PostForm from "../components/editor/PostForm";
import { postService } from "../services/postService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Toast from "../components/ui/Toast";

const EditPost = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000);
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await postService.getPostById(id);

        if (result.success) {
          setPost(result.data.post);
          navigate(`/edit/${result.data.post._id}`);
        } else {
          showToast(result.message || "Failed to load post");
          
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        showToast("Failed to load post");
        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleUpdatePost = async (postData) => {
    if (!post) return;

    setSubmitting(true);

    try {
      const result = await postService.updatePost(post._id, postData);

      if (result.success) {
        showToast("Post updated successfully!", "success");

        // Redirect to the updated post
        setTimeout(() => {
          navigate(`/posts/${result.data.post.slug}/${result.data.post._id}`);
        
        }, 1500);
      } else {
        showToast(result.message || "Failed to update post");
        navigate("/posts");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showToast("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Post not found
          </h2>
          <button
            onClick={() => navigate("/posts")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600 mt-1">
              Update your post content and information
            </p>
          </div>

          <PostForm
            onSubmit={handleUpdatePost}
            submitButtonText="Update Post"
            isLoading={submitting}
            initialData={post}
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

export default EditPost;
