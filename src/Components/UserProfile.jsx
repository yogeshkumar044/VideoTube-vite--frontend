import React, { useState, useEffect, useContext } from 'react';
import { LoginContext } from '../Context/LoginContext';
import { getUserData } from '../Utilis/GetUserDataService';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { isLoggedIn, currentUserId, loading } = useContext(LoginContext);
  // const test = "66b1f7718ea99a751ace23f7";

  useEffect(() => {
   
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      try {
        // console.log("Fetching user data for:", currentUserId); 
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

 
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-gray-700 to-gray-700 text-white rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
      {user && (
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32">
            <img
              src={user.avatar || 'default-avatar.png'}
              alt="User Avatar"
              className="w-full h-full rounded-full border-4 border-blue-500 object-cover shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300 ease-in-out"
            />
          </div>
          <h2 className="text-3xl font-bold text-blue-400 hover:text-blue-500 transition-colors duration-300 ease-in-out">{user.fullName}</h2>
          <p className="text-gray-400 hover:text-gray-200 transition-colors duration-300 ease-in-out">{user.email}</p>
          <p className="text-lg font-semibold text-gray-300">Username: {user.username}</p>
          <div className="w-full bg-gray-700 h-[1px] mt-4"></div>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-300">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-300">Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
          <div className="mt-6 flex justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
