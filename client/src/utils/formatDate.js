const formatDate = (dateString) => {
  if (!dateString) return "a moment ago";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "1d ago";
  if (diffInDays < 30) return `${diffInDays}d ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default formatDate;
