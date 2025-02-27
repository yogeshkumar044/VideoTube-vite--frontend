import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { LoginContext } from '../Context/LoginContext';
import { Play, Video, User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const isEmail = identifier.includes('@');

        try {
            const { data } = await axios.post('http://localhost:8000/api/v1/users/login', {
                [isEmail ? 'email' : 'username']: identifier,
                password,
            });

            const { accessToken } = data.data;
            localStorage.setItem('authToken', accessToken);
            
            setIsLoggedIn(true);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-center mb-6">
                        <Play className="w-12 h-12 text-red-500 mr-2" />
                        <h1 className="text-3xl font-bold text-white">VideoTube</h1>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Video className="w-5 h-5 animate-pulse" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <div className="text-center space-y-3 mt-6">
                        <p className="text-gray-300">
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                className="text-red-500 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                        <Link 
                            to="#" 
                            className="text-gray-400 hover:text-red-500 transition"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;