import axios from 'axios';

// Function to handle login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/users/login', credentials);
    
    // Extract data from response based on your backend structure
    const { status, data, message } = response.data;

    // Handle token and user data if present
    if (status === 200 && data) {
      const { token, user } = data; // Adjust if the response data structure is different
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user)
      
      return user;
    } else {
      throw new Error(message || 'Login failed');
    }
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
};

// Function to handle registration
export const registerUser = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Extract data from response based on your backend structure
    const { status, data, message } = response.data;

    console.log(data)

    // Handle token and user data if present
    if ( data) {
      const { token, user } = data; // Adjust if the response data structure is different
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } else {
      throw new Error(message || 'Registration failed');
    }
  } catch (err) {
    console.error('Registration failed:', err);
    throw err;
  }
};


// setUsername('');
      // setEmail('');
      // setFullName('');
      // setAvatar(null);
      // setCoverImage(null);
      // setPassword('');