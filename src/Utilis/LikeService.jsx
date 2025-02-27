import axios from 'axios';

export const toggleLike = async (videoId, userId, isLike = true) => {

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`http://localhost:8000/api/v1/likes/toggle/v/${videoId}`, 
      {
        videoId,
        likedBy: userId,
        LikedorDisliked: isLike,
      }, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    // console.log(response,"toggle")


    const { statusCode, message } = response.data;

    if (statusCode === 200) {
      return message;
    } else {
      throw new Error(message || 'Failed to toggle like/dislike');
    }
  } catch (err) {
    console.error('Failed to toggle like/dislike:', err);
    throw err;
  }
};

export const getVideoLikeDislikeCount = async (videoId , userId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`http://localhost:8000/api/v1/likes/${videoId}`, 
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
      // console.log(response,"getlike")

    const { statusCode, data, message } = response.data;


    if (statusCode === 200) {
      return data;
    } else {
      throw new Error(message || 'Failed to fetch like/dislike counts');
    }
  } catch (err) {
    console.error('Failed to fetch like/dislike counts:', err);
    throw err;
  }
};

