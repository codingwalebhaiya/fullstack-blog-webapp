import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/outline";
import formatDate from "../utils/formatDate.js";
import SafeHTML from "./editor/SafeHTML.jsx";

export default function PostCard({ post }) {
  if (!post || !post.title) return null;

  const postUrl = `/posts/${post.slug}/${post._id}`;
  const authorInitial = post.userId?.username ? post.userId.username[0] : "A";
  const authorName = post.userId?.username || "Unknown Author";
  const excerpt = post.excerpt || "No description available";

  return (
    <article
      className="
        py-6 border-b border-gray-200 cursor-pointer 
        hover:bg-gray-50 transition duration-150 ease-in-out 
      "
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 mr-2 flex-shrink-0">
            {authorInitial}
          </div>
          <p className="font-medium text-gray-700 text-sm truncate max-w-[200px]">{authorName}</p>
        </div>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <Link to={postUrl} className="block">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug hover:text-gray-700 transition">
                {post.title}
              </h2>
            </Link>

            <div className="hidden sm:block text-base text-gray-600 mt-1 mb-2 line-clamp-2">
              <SafeHTML
                html={excerpt}
                stripTags={true} // Remove all HTML tags for excerpts
                maxLength={50} // Limit excerpt length
              />
            </div>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-28 h-20 md:w-32 md:h-24 flex-shrink-0">
            <Link to={postUrl}>
              <img
                src={post.postImageUrl}
                alt={post.title}
                className="w-full h-full object-cover rounded-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/128x96/f3f4f6/374151?text=Post`;
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
