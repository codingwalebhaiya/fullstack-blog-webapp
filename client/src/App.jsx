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
        {/* Protected admin routes group */}
        {/* '/admin' path will render AdminLayout, and nested routes fill Outlet */}

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPostList />} />
            <Route path="users" element={<AdminUsersList />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
