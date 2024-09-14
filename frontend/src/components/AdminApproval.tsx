import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';
import config from '../config';

interface User {
  id: string;
  email: string;
  approved: boolean;
  createdAt: string;
}

const API_URL = config.API_URL;

const AdminApproval: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { token } = useAuth();
  const { setError, setSuccess } = useMessage();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/admin/pending-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch pending users:', error);
        setError('Failed to fetch pending users. Please try again.');
      }
    };

    fetchUsers();
  }, [token, setError]);

  const approveUser = async (userId: string) => {
    try {
      await axios.post(`${API_URL}/auth/approve/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.id !== userId));
      setSuccess('User approved successfully');
    } catch (error) {
      console.error('Failed to approve user:', error);
      setError('Failed to approve user. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Pending User Approvals</h2>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user.id} className="flex justify-between items-center border p-4 rounded">
            <div>
              <span className="font-bold">{user.email}</span>
              <span className="ml-4 text-sm text-gray-500">Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <button
              onClick={() => approveUser(user.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
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