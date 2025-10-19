// import React from 'react';
// import { Link } from 'react-router-dom';

// const AdminDashboard = () => {
//   const stats = [
//     { label: 'Total Users', value: '1,234', icon: '👥', change: '+12%' },
//     { label: 'Total Posts', value: '5,678', icon: '📝', change: '+8%' },
//     { label: 'Published Posts', value: '4,321', icon: '✅', change: '+5%' },
//     { label: 'Pending Review', value: '45', icon: '⏳', change: '-2%' }
//   ];

//   const recentActivities = [
//     { user: 'john_doe', action: 'created a new post', time: '2 minutes ago' },
//     { user: 'jane_smith', action: 'registered as writer', time: '1 hour ago' },
//     { user: 'mike_johnson', action: 'published a post', time: '3 hours ago' },
//     { user: 'sarah_wilson', action: 'commented on a post', time: '5 hours ago' }
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-600">
//           Welcome to the administration panel. Manage your platform effectively.
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="text-3xl">{stat.icon}</div>
//               <span className={`text-sm font-medium ${
//                 stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 {stat.change}
//               </span>
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
//             <div className="text-gray-600 text-sm">{stat.label}</div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Quick Actions */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Link
//               to="/admin/users"
//               className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
//             >
//               <div className="text-2xl mb-2">👥</div>
//               <div className="font-medium text-gray-900">User Management</div>
//               <div className="text-sm text-gray-600">Manage all users</div>
//             </Link>
            
//             <Link
//               to="/admin/posts"
//               className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
//             >
//               <div className="text-2xl mb-2">📝</div>
//               <div className="font-medium text-gray-900">Post Management</div>
//               <div className="text-sm text-gray-600">Review and manage posts</div>
//             </Link>
            
//             <Link
//               to="/admin/categories"
//               className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
//             >
//               <div className="text-2xl mb-2">📂</div>
//               <div className="font-medium text-gray-900">Categories</div>
//               <div className="text-sm text-gray-600">Manage categories</div>
//             </Link>
            
//             <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
//               <div className="text-2xl mb-2">📊</div>
//               <div className="font-medium text-gray-900">Analytics</div>
//               <div className="text-sm text-gray-600">View platform stats</div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             {recentActivities.map((activity, index) => (
//               <div key={index} className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-sm">🔔</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-gray-900">
//                     <span className="font-medium">{activity.user}</span>{' '}
//                     {activity.action}
//                   </p>
//                   <p className="text-gray-500 text-sm">{activity.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* System Status */}
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//             <span className="text-green-800 font-medium">Database</span>
//             <span className="text-green-600">✅ Online</span>
//           </div>
//           <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//             <span className="text-green-800 font-medium">API Server</span>
//             <span className="text-green-600">✅ Online</span>
//           </div>
//           <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//             <span className="text-green-800 font-medium">File Storage</span>
//             <span className="text-green-600">✅ Online</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// src/admin/pages/AdminDashboard.jsx


const AdminDashboard = () => (
  <div className="text-gray-800 dark:text-gray-200">
    <h2 className="text-2xl font-bold mb-4">Overview</h2>
    <p>Welcome to the Admin Dashboard 👋</p>
  </div>
);

export default AdminDashboard;
