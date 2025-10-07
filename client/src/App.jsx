import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import { ToastContainer } from "react-toastify";
import PostListPage from "./pages/PostListPage";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Home page with Hero + PostList */}
        <Route path="/" element={<Home />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Post CRUD routes */}
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:slug/:id" element={<PostDetail />} />
        {/* <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />}  /> */}

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
