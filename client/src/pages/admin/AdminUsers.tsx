import React from 'react';

const AdminUsers: React.FC = () => {
  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com' },
    { id: 2, name: 'Trần Thị B', email: 'b@yahoo.com' },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <ul className="space-y-3">
        {mockUsers.map((u) => (
          <li key={u.id} className="border p-3 rounded">
            <p>{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
