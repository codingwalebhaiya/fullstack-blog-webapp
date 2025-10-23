import { createContext, useEffect, useState } from "react";
import API from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([{ title: "", content: "" }]);
  const [signalPost, setSinglePost] = useState({ title: "", content: "" });
  const [editSignalPost, SetEditSinglePost] = useState({
    title: "",
    content: "",
  });
 // const { postId } = useParams();
 const { id } = useParams();
 
  
  //const { state } = useLocation();
  const navigate = useNavigate();

  const createPost = async (formData) => {
    const res = await API.post("/posts", { formData });
    if (res.status === 200) {
      toast.success("Post created successfully!");
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      const res = await API.get("/posts");
      setAllPosts(res.data.posts);
    };

    fetchAllPosts();
  }, []);

  // useEffect(() => {
  //   const fetchSinglePostById = async () => {
  //     const res = await API.get(`/posts/${postId}`);
  //     setSinglePost(res.data.post);
  //   };
  //   if (post === undefined || post !== state.post) {
  //     fetchSinglePostById();
  //   }
  // }, [state.signalPost]);

  const deleteSingalPost = async () => {
    const res = await API.delete(`/posts/${id}`, { withCredentials: true });
    if (res.status === 200) {
      toast.success("Successfully post deleted!");
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchPostById = async () => {
      const res = await API.get(`/post/${id}`);
      setSinglePost(res.data.post);
    };

    fetchPostById();
  }, []);

  useEffect(() => {
    const editPostById = async () => {
      const res = await API.post(`/post/${id}`);
      SetEditSinglePost(res.data.post);
    };

    editPostById();
  }, []);

  const value = {
    createPost,
    editSignalPost,
    allPosts,
    signalPost,
    deleteSingalPost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;
