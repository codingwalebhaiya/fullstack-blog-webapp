import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.js"
import { toast } from "react-toastify";
import API from "../../utils/api.js";

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth()

  useEffect(() => {
    if (!token) return;
    setError(null);
    setLoading(true);

    try {
      const fetchUsers = async () => {
        const res = await API.get("/api/v1/users");
        console.log(res);
        
        setUsers(res.data.users);
      };

      fetchUsers();
    } catch (error) {
      setError(error.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (userId) => {
    try {
      await API.delete(`/api/v1/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setError(null);
      toast.success("User deleted successfully");
    } catch (error) {
      setError(error.message || "Failed to delete user");
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-white ">
            <tr className="bg-yellow-600">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u._id}
                className="border-t border-gray-100 dark:border-gray-700 text-white "
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">
                  {u.username || `${u.firstName} ${u.lastName}`}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role || "user"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
