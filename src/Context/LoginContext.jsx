import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null); // State for storing current user ID

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/v1/users/current-user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200 && response.data?.data) {
                    setIsLoggedIn(true);
                    setCurrentUserId(response.data.data._id); // Store user ID in the state
                    // localStorage.setItem('user', JSON.stringify(response.data.data)); // Optionally store entire user data if needed
                }
            } catch (err) {
                console.error('Token validation failed:', err);
                setIsLoggedIn(false);
                localStorage.removeItem('authToken');
                setCurrentUserId(null); // Clear the user ID if validation fails
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading, setLoading, currentUserId ,setCurrentUserId }}>
            {children}
        </LoginContext.Provider>
    );
};
