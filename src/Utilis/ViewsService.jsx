import axios from 'axios';

export const incrementViewCount = async (videoId ,userId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    // Send a PATCH request to increment the view count
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/views/${videoId}`, 
      {
        videoId,
        channelId: userId,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { statusCode, message } = response.data;
    // console.log(response.data.data,"tyttttttttttttttttttttttt");

    if (statusCode === 200) {
      return response.data.data; // Success message after incrementing views
    } else {
      throw new Error(message || 'Failed to increment views');
    }
  } catch (err) {
    console.error('Failed to increment views:', err);
    throw err;
  }
};
