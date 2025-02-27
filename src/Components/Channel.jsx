import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { toggleSubscription, getUserChannelSubscribers } from '../Utilis/SubscriptionService';
import { LoginContext } from '../Context/LoginContext';
import { getAllVideos } from '../Utilis/GetAllVideosService';
import VideoCard from './Video/VideoCard';

const Channel = () => {
  const location = useLocation();
  const { owner } = location.state || {};
  console.log(owner);
  
  const { currentUserId } = useContext(LoginContext);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortType, setSortType] = useState('desc');
  const [activeTab, setActiveTab] = useState('videos');
  const [error, setError] = useState(null);

  // Fetch Owner Info Once
  useEffect(() => {
    const fetchOwnerData = async () => {
      if (owner?._id && currentUserId) {
        setLoading(true);
        setError(null);
        try {
          const subscriberData = await getUserChannelSubscribers(owner._id, currentUserId);
          setIsSubscribed(subscriberData.isSubscribed);
          setSubscribersCount(subscriberData.subscriberCount);
        } catch (error) {
          console.error('Error fetching subscriber data:', error);
          setError('Failed to load channel data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOwnerData();
  }, [owner, currentUserId]);

  // Fetch Videos Based on Page and Sort
  const fetchVideos = useCallback(async () => {
    if (owner?._id && activeTab === 'videos') {
      setLoading(true);
      setError(null);
      try {
        const videoData = await getAllVideos(page, 12, '', sortBy, sortType, owner._id);
        const { data: fetchedVideos, totalVideos: total } = videoData;

        setTotalVideos(total);
        setVideos((prevVideos) => (page === 1 ? fetchedVideos : [...prevVideos, ...fetchedVideos]));
        setHasMore(fetchedVideos.length > 0);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    }
  }, [owner, page, sortBy, sortType, activeTab]);

  useEffect(() => {
    if (activeTab === 'videos') {
      fetchVideos();
    }
  }, [fetchVideos]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >= 
      document.documentElement.scrollHeight && 
      hasMore && 
      !loading && 
      activeTab === 'videos'
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading, activeTab]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleSortChange = (value) => {
    const sortSettings = {
      latest: ['createdAt', 'desc'],
      oldest: ['createdAt', 'asc'],
      mostLiked: ['likes', 'desc'],
    };
    setSortBy(sortSettings[value][0]);
    setSortType(sortSettings[value][1]);
    setPage(1);
    setVideos([]);
  };

  const handleSubscriptionToggle = async () => {
    try {
      await toggleSubscription(owner._id, currentUserId);
      setIsSubscribed((prev) => !prev);
      setSubscribersCount((prev) => (isSubscribed ? prev - 1 : prev + 1));
    } catch (error) {
      console.error('Error toggling subscription:', error);
      setError('Failed to toggle subscription.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'videos') {
      setPage(1);
      setVideos([]);
    }
  };

  if (!owner) return <div className="text-white">User not found.</div>;

  return (
    <div className="bg-[rgb(19,19,19)] min-h-screen w-full text-white">
      {/* Owner Info Header */}
      <div className="bg-transparent w-full shadow-lg">
        <div className="bg-transparent flex items-start w-screen h-auto px-4 py-4">
          {owner.avatar ? (
            <img src={owner.avatar} alt={`${owner.username}'s avatar`} className="w-44 h-44 rounded-full" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-500" />
          )}
          <div className="flex-1 ml-6">
            <h2 className="text-4xl font-bold">{owner.username}</h2>
            <p className="text-lg py-2">
              {subscribersCount} {subscribersCount === 1 ? 'Subscriber' : 'Subscribers'} 
              <span className='mr-2 ml-2'>|</span> 
              {totalVideos} {totalVideos === 1 ? 'Video' : 'Videos'}
            </p>
            <button
              onClick={handleSubscriptionToggle}
              className={`px-6 py-2 font-semibold rounded-full transition duration-300 ease-in-out 
                ${isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-4 px-8 py-3">
          <button
            onClick={() => handleTabChange('videos')}
            className={`text-lg ${activeTab === 'videos' ? 'font-bold text-blue-600' : 'text-gray-400'}`}
          >
            Videos
          </button>
          <button
            onClick={() => handleTabChange('playlists')}
            className={`text-lg ${activeTab === 'playlists' ? 'font-bold text-blue-600' : 'text-gray-400'}`}
          >
            Playlists
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'videos' && (
        <div className="px-4 bg-[rgb(19,19,19)] w-screen h-screen">
          {/* Sort Controls */}
          <div className="flex space-x-1 text-white rounded-xl select-none max-w-64 my-2">
            <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="latest"
                className="peer hidden"
                checked={sortBy === 'createdAt' && sortType === 'desc'}
                onChange={() => handleSortChange('latest')}
              />
              <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-400 rounded-lg transition duration-150 ease-in-out">
                Latest
              </span>
            </label>

            <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="oldest"
                className="peer hidden"
                checked={sortBy === 'createdAt' && sortType === 'asc'}
                onChange={() => handleSortChange('oldest')}
              />
              <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-400 rounded-lg transition duration-150 ease-in-out">
                Oldest
              </span>
            </label>

            <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value="mostLiked"
                className="peer hidden"
                checked={sortBy === 'likes' && sortType === 'desc'}
                onChange={() => handleSortChange('mostLiked')}
              />
              <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[blueviolet] peer-checked:to-[violet] peer-checked:text-white text-gray-400 rounded-lg transition duration-150 ease-in-out">
                Most Liked
              </span>
            </label>
          </div>

          {/* Videos Grid */}
          <div className="py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
          
          {videos.length === 0 && !loading && (
            <p className="text-center mt-6 text-gray-400">No videos available</p>
          )}
          
          {loading && <div className="text-white text-center">Loading more videos...</div>}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="px-4 text-center py-4">
          Playlists content goes here
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}
    </div>
  );
};

export default Channel;