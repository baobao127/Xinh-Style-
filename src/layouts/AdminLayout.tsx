import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div className="flex min-h-screen">
    <AdminSidebar />
    <div className="flex-1 p-4 bg-gray-50">{children}</div>
  </div>
);
export default AdminLayout;