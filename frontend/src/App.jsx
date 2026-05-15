import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

/**
 * Protected Route Component
 */
function ProtectedRoute({ element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Beautiful Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '9999px',
              background: '#333',
              color: '#fff',
              padding: '16px 24px',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;