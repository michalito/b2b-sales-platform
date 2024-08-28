import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

interface User {
  id: string;
  email: string;
  approved: boolean;
}

const AdminApproval: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/pending-users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        setMessage('Failed to fetch pending users');
      }
    };

    fetchUsers();
  }, [token]);

  const approveUser = async (userId: string) => {
    try {
      await axios.post(`http://localhost:3000/api/auth/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.id !== userId));
      setMessage('User approved successfully');
    } catch (error) {
      setMessage('Failed to approve user');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Pending User Approvals</h2>
      {message && <p className="mb-4 text-center">{message}</p>}
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="flex justify-between items-center border p-4 rounded">
            <span>{user.email}</span>
            <button
              onClick={() => approveUser(user.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
      {users.length === 0 && <p>No pending approvals</p>}
    </div>
  );
};

export default AdminApproval;