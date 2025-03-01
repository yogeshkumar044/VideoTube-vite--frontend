import axios from 'axios';

export const getWatchedHistory = async (page = 1, limit = 12, sortBy = 'watchedAt', sortType = 'desc') => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/history`,
       {
        page, limit, sortBy, sortType
       },
       {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log(response,"history")
    const { statusCode, data, message } = response.data;
    const { watchHistory ,totalWatchedVideos } = data;

    console.log(response, "getWatchedHistory");

    if (statusCode === 200) {
      return { watchHistory, totalWatchedVideos };
    } else {
      console.log("Failed to fetch watched history");
      // throw new Error(message || 'Failed to fetch watched history');
    }
  } catch (err) {
    console.error('Failed to fetch watched history:', err);
    // throw err;
  }
};
