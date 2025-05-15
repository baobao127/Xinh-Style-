import React from 'react';

const AdminUsers: React.FC = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có user nào được lưu.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((u: any, idx: number) => (
            <li key={idx} className="border p-3 rounded">
              <p><strong>Họ tên:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsers;
