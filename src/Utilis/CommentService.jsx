import axios from 'axios';

// Function to handle comment upload
export const uploadComment = async (commentData, videoId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`http://localhost:8000/api/v1/comments/${videoId}`, commentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Comment upload failed');
    }
  } catch (err) {
    console.error('Comment upload failed:', err);
    throw err;
  }
};

// Function to fetch video comments
export const GetVideoComment = async (videoId, query) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.get(`http://localhost:8000/api/v1/comments/${videoId}`, {
      params: query,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const { statusCode, data, message } = response.data;
    const { comments, totalCount } = data;

    if (statusCode === 200) {
      return { comments, totalCount };
    } else {
      throw new Error(message || 'Failed to fetch comments');
    }
  } catch (err) {
    console.error('Failed to fetch comment:', err);
    throw err;
  }
};

// Function to update a comment
export const updateComment = async (commentId, updatedContent) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.patch(
      `http://localhost:8000/api/v1/comments/c/${commentId}`,
      { content: updatedContent },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update the comment');
    }
  } catch (err) {
    console.error('Failed to update comment:', err);
    throw err;
  }
};

// Function to delete a comment
export const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.delete(`http://localhost:8000/api/v1/comments/c/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to delete the comment');
    }
  } catch (err) {
    console.error('Failed to delete comment:', err);
    throw err;
  }
};
