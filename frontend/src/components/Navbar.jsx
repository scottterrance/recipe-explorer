import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-500">
          🍳 Recipe Explorer
        </Link>

        {/* Links */}
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-orange-500">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-orange-500">
                Dashboard
              </Link>
              <span className="text-gray-600">Hi, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-orange-500">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;