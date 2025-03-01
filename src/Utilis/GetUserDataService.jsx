import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/current-user`;

export const getUserData = async (token , userId) => {
  if(!userId){
    throw new Error('userId is missing');
    return;
  }
  try {
    const response = await axios.get(API_URL, {
      params:{userId},
      headers: {
        'Authorization': `Bearer ${token}`,  // Corrected line
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to load profile');
  }
};
