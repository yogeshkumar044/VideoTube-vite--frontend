import axios from 'axios';

const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('authToken');
    // localStorage.removeItem('user');

    return { success: true };
  } catch (err) {
    console.error('Logout failed:', err);
    return { success: false, error: err };
  }
};

export default logout;
