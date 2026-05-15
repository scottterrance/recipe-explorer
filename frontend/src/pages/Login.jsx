import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-primary" />
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Recipe Explorer
            </span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome back</h2>
          <p className="text-gray-500 text-center mb-8">Sign in to continue exploring</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-3xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-3xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-3xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;