import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';
import { getUserData } from '../Utilis/GetUserDataService';
import { User, Mail, Calendar, Edit, AtSign, Camera, Clock } from 'lucide-react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { isLoggedIn, currentUserId, loading } = useContext(LoginContext);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const userData = await getUserData(token, currentUserId);
        setUser(userData);
        setError('');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile');
      }
    };

    if (isLoggedIn && currentUserId) {
      fetchUserProfile();
    } else if (isLoggedIn === false) {
      setError('User not logged in');
    }
  }, [isLoggedIn, currentUserId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
      <div className="bg-red-500/20 border border-red-500 text-red-300 p-6 rounded-xl text-center max-w-md mx-4">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      {user && (
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Cover Image Area */}
          <div className="h-48 bg-gradient-to-r from-indigo-800 to-purple-800 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <img
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 border-black object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200">
                  <Camera size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user.fullName}</h1>
                <div className="flex items-center text-gray-300 space-x-2 bg-black/20 px-3 py-1 rounded-full w-fit">
                  <AtSign size={16} className="text-red-500" />
                  <span className="font-medium">{user.username}</span>
                </div>
              </div>
              <button className="flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-red-600/30 space-x-2 font-medium">
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/20 p-5 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Mail className="text-red-500" size={20} />
                  </div>
                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Email Address</span>
                </div>
                <p className="text-white font-medium text-lg pl-11">{user.email}</p>
              </div>

              <div className="bg-black/20 p-5 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Calendar className="text-red-500" size={20} />
                  </div>
                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Joined Date</span>
                </div>
                <p className="text-white font-medium text-lg pl-11">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-black/20 p-5 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300 md:col-span-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Clock className="text-red-500" size={20} />
                  </div>
                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Last Updated</span>
                </div>
                <p className="text-white font-medium text-lg pl-11">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
