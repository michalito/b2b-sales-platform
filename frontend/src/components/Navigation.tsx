import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between items-center">
        <li>
          <Link to="/" className="text-xl font-bold">Home</Link>
        </li>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <li>Welcome, {user?.email}</li>
              {user?.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/approvals" className="hover:text-gray-300">Approvals</Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="hover:text-gray-300">Manage Products</Link>
                  </li>
                </>
              )}
              <li>
                <button onClick={logout} className="hover:text-gray-300">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navigation;