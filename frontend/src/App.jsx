import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

/**
 * Protected Route - Requires Authentication
 */
function ProtectedRoute({ element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;