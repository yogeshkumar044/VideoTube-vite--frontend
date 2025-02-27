import axios from 'axios';

export const getVideoById = async (videoId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Send a GET request to fetch the video details by ID
    const response = await axios.get(
      `http://localhost:8000/api/v1/videos/${videoId}`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { statusCode, data, message } = response.data;

    // Handle the response
    if (statusCode === 200) {
      return data; // Return the video details
    } else {
      throw new Error(message || 'Failed to fetch video details');
    }
  } catch (err) {
    console.error('Failed to fetch video details:', err);
    throw err;
  }
};
