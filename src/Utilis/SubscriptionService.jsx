import axios from 'axios';

export const toggleSubscription = async (channelId ,subscriberId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscription/t/${channelId}`,
      {
        channelId ,
        subscriberId
    },
      {
        headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const { statusCode, message } = response.data;

    if (statusCode === 200) {
      return message; // return subscription message (Subscribed/Unsubscribed)
    } else {
      throw new Error(message || 'Failed to toggle subscription');
    }
  } catch (err) {
    console.error('Failed to toggle subscription:', err);
    throw err;
  }
};

export const getUserChannelSubscribers = async (channelId , userId) => {
  // console.log(channelId , userId,"channelId , userId from service");
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscription/u/${channelId}`,
      {
        channelId ,
        userId,
    },
      {
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });


    const { statusCode, data, message } = response.data;

    if (statusCode === 200) {
      // console.log(`Subscribers count: ${data}`);
      return data; // return subscribers count
    } else {
      throw new Error(message || 'Failed to fetch subscribers');
    }
  } catch (err) {
    console.error('Failed to fetch subscribers:', err);
    throw err;
  }
};

export const getSubscribedChannels = async (subscriberId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscription/c/${subscriberId}`, 
      {
        subscriberId ,
      } ,
      {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const { statusCode, data, message } = response.data;

    if (statusCode === 200 && Array.isArray(data)) {
      console.log(`Subscribed channels count: ${data.length}`);
      return data; // return the list of subscribed channels
    } else {
      throw new Error(message || 'Failed to fetch subscribed channels');
    }
  } catch (err) {
    console.error('Failed to fetch subscribed channels:', err);
    throw err;
  }
};
