import axios from 'axios';

// Function to handle video upload
export const uploadVideo = async (videoData) => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from local storage
    // console.log(token)

    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/`, videoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
      },
    });

    console.log(response.data);

    const { statusCode, data, message } = response.data;

    if (statusCode === 200 && data) {
      return data; // Handle the response data as needed
    } else {
      throw new Error(message||'Video upload failed');
    }
  } catch (err) {
    console.error('Video upload failed:', err);
    throw err;
  }
};
