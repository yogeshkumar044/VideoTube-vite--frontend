import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Image, 
  Video, 
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { registerUser } from '../Utilis/AuthService';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    avatar: null,
    coverImage: null,
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const signupData = new FormData();
    Object.entries(formData).forEach(([key, value]) => signupData.append(key, value));

    try {
      await registerUser(signupData);
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
      setFormData({
        username: '',
        email: '',
        fullName: '',
        avatar: null,
        coverImage: null,
        password: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Video className="w-12 h-12 text-red-500 mr-2" />
            <h1 className="text-3xl font-bold text-white">VideoTube</h1>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { id: 'username', icon: User, placeholder: 'Username' },
              { id: 'email', icon: Mail, placeholder: 'Email', type: 'email' },
              { id: 'fullName', icon: User, placeholder: 'Full Name' }
            ].map(({ id, icon: Icon, placeholder, type = 'text' }) => (
              <div key={id} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            ))}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-white">
                <Image className="w-5 h-5 mr-2 text-gray-400" />
                <label>Avatar Image</label>
              </div>
              <input
                id="avatar"
                type="file"
                onChange={handleChange}
                required
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-red-500 file:text-white hover:file:bg-red-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-white">
                <Upload className="w-5 h-5 mr-2 text-gray-400" />
                <label>Cover Image (Optional)</label>
              </div>
              <input
                id="coverImage"
                type="file"
                onChange={handleChange}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-purple-500 file:text-white hover:file:bg-purple-600 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Video className="w-5 h-5 animate-pulse" />
                  <span>Signing up...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center space-y-3 mt-6">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-red-500 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;