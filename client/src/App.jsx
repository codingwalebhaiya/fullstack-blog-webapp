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
import AdminLayout from "./layouts/AdminLayout";
import AdminPostList from "./pages/Admin/AdminPostList";
import AdminUsersList from "./pages/Admin/AdminUsersList";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import AuthorLayout from "./layouts/AuthorLayout";
import AuthorDashboard from "./pages/Author/AuthorDashboard";
import AuthorPostList from "./pages/Author/AuthorPostList";
import AuthorProfile from "./pages/Author/AuthorProfile";
import ReaderLayout from "./layouts/ReaderLayout";
import ReaderDashboard from "./pages/Reader/ReaderDashboard";
import ReaderProfile from "./pages/Reader/ReaderProfile";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:slug/:id" element={<PostDetail />} />

        {/* Protected routes */}
        <Route
          element={
            <PrivateRoute allowedRoles={["reader", "author", "admin"]} />
          }
        >
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPostList />} />
            <Route path="users" element={<AdminUsersList />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["author"]} />}>
          <Route path="/author" element={<AuthorLayout />}>
            <Route index element={<AuthorDashboard />} />
            <Route path="dashboard" element={<AuthorDashboard />} />
            <Route path="posts" element={<AuthorPostList />} />
            <Route path="profile" element={<AuthorProfile />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["reader"]} />}>
          <Route path="/reader" element={<ReaderLayout />}>
            <Route index element={<ReaderDashboard />} />
            <Route path="dashboard" element={<ReaderDashboard />} />
            <Route path="Profile" element={<ReaderProfile />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
