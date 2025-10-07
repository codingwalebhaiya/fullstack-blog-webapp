import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api.js";
import formatDate from "../utils/formatDate.js";

const PostDetail = () => {
  const [signalPost, setSignalPost] = useState({
    title: "",
    content: "",
    postImageUrl: "",
    createdAt: "",
    userId: {
      username: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchPostById = async () => {
      setLoading(true);
      try {
        
        const res = await API.get(`/posts/${id}`);
        setSignalPost(res.data.post);
        setError(null);
      } catch (err) {
        console.error("Fetch Post Error:", err);
        setError(err.response?.data?.error || "Failed to load post");
        setSignalPost({
          title: "",
          content: "",
          postImageUrl: "",
          createdAt: "",
          userId: { username: "" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPostById();
  }, [id]);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading Post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-900">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  
  const authorInitial = signalPost.userId.username
    ? signalPost.userId.username[0]
    : "A";
  const authorName = signalPost.userId.username || "Anonymous Author";
  const postDate = formatDate(signalPost.createdAt);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-center">
          {/* Use max-w-2xl or max-w-3xl for the ideal reading width (the center column) */}
          <main className="w-full lg:max-w-4xl xl:max-w-5xl py-10 lg:py-16">
            <header className="mb-8 px-0 sm:px-0">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-snug tracking-tight mb-4 text-gray-900">
                {signalPost.title}
              </h1>

              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                    {authorInitial}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{authorName}</p>
                    <p className="text-sm text-gray-600">{postDate}</p>
                  </div>
                </div>

                {/* <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-700 text-white rounded-full hover:bg-green-800 transition">
                  <UserPlusIcon className="w-4 h-4" />
                  <span>Follow</span>
                </button> */}
              </div>
            </header>

            {signalPost.postImageUrl && (
              <div className="w-full mb-10 overflow-hidden">
                <img
                  src={signalPost.postImageUrl}
                  alt={signalPost.title}
                  className="w-full h-auto object-cover rounded-none shadow-none"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/1200x600/374151/ffffff?text=${encodeURIComponent(
                      signalPost.title || "Blog Post"
                    )}`;
                  }}
                />
              </div>
            )}

            <article
              // Using prose for optimal reading typography, limiting the width to match the screenshot's style
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif"
            >
              {/* NOTE: You need a Markdown renderer for proper HTML output. 
                                This simple map is fine for basic text content, but it won't render true Markdown. */}
              {signalPost.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          </main>

          <div className="hidden lg:block w-[100px] xl:w-[120px] flex-shrink-0">
            {/* Empty space for layout balance */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
