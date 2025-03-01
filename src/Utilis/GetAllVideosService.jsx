import axios from 'axios';

export const getAllVideos = async (page = 1, limit = 12, query = '', sortBy = 'createdAt', sortType = 'desc', ownerId = null ) => {
  try {
    // console.log(query,"allalllallalallalalallalla")
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos`, {
      params: { page, limit, query, sortBy, sortType, ownerId },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });


    const { statusCode, data, message ,moredata } = response.data;
    const {total}= moredata;
    // console.log(response,"getservise")

    if (statusCode === 200 && Array.isArray(data)) {
      return {data,totalVideos:total}; 
    } else {
      // throw new Error(message || 'Failed to fetch videos');
      console.log("user is logged out ")
    }
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    // throw err;
  }
};
