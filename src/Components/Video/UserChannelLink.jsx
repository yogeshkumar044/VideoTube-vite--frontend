import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toggleSubscription, getUserChannelSubscribers } from '../../Utilis/SubscriptionService';
import { toggleLike, getVideoLikeDislikeCount } from '../../Utilis/LikeService'; 
import { LoginContext } from '../../Context/LoginContext';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const OwnerInfo = ({ owner , video} ) => {

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(3); // 3 for neither like nor dislike
  const { currentUserId } = useContext(LoginContext);
  

  useEffect(() => {
    if (owner) {
      fetchSubscribers();
      fetchLikes();
    }
  }, [owner]);

  const fetchSubscribers = async () => {
    try {
      const data = await getUserChannelSubscribers(owner._id, currentUserId);
      setIsSubscribed(data.isSubscribed);
      setSubscribersCount(data.subscriberCount);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const data = await getVideoLikeDislikeCount(video._id, currentUserId);
      
      setLikesCount(data.likedCount);
      setDislikesCount(data.dislikedCount);
      
      // Set `hasLiked` based on the value from the backend
      if (data.isLiked === null) {
        setHasLiked(3); // 3 for neither liked nor disliked
      } else {
        setHasLiked(data.isLiked); // `1` for like, `2` for dislike, `3` for neither
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleSubscriptionToggle = async () => {
    try {
      const message = await toggleSubscription(owner._id, currentUserId);
      console.log(message);
      setIsSubscribed((prev) => !prev);
      fetchSubscribers();
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const handleLikeToggle = async () => {
    try {
      await toggleLike(video._id, currentUserId, 1);

      // Optimistic UI update
      if (hasLiked === 1) {
        setHasLiked(3); // Remove like
        setLikesCount((prev) => prev - 1);
      } else {
        if (hasLiked === 2) {
          setDislikesCount((prev) => prev - 1); // Remove dislike
        }
        setHasLiked(1); // Like
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislikeToggle = async () => {
    try {
      await toggleLike(video._id, currentUserId, 2);

      // Optimistic UI update
      if (hasLiked === 2) {
        setHasLiked(3); // Remove dislike
        setDislikesCount((prev) => prev - 1);
      } else {
        if (hasLiked === 1) {
          setLikesCount((prev) => prev - 1); // Remove like
        }
        setHasLiked(2); // Dislike
        setDislikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  if (!owner) {
    return <span className="text-gray-400">Unknown</span>;
  }

  return (
    <div className="flex flex-col w-full bg-transparent rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 py-1">
      <div className="flex items-center">
        <Link to={`/channel/${owner.username}`} state={{ owner }}>
          {owner.avatar ? (
            <img
              src={owner.avatar}
              alt={`${owner.username}'s avatar`}
              className="w-12 h-12 rounded-full mr-4 border-2 border-white transition-transform transform hover:scale-110"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-500 mr-4" />
          )}
        </Link>
        <div>
          <span className="text-xl font-semibold text-white">
            <Link
              to={`/channel/${owner.username}`}
              state={{ owner }}
              className="text-white hover:underline transition duration-200 ease-in-out"
            >
              {owner.username}
            </Link>
          </span>
          <span className="block text-gray-300 text-sm">
            {subscribersCount} {subscribersCount === 1 ? 'Subscriber' : 'Subscribers'}
          </span>
        </div>
        <div className="mx-8">
          <button
            onClick={handleSubscriptionToggle}
            className={`px-6 py-2 text-white font-semibold rounded-2xl transition duration-300 ease-in-out 
            ${isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </div>
        {/* Like Button */}
        <div className="mx-2 flex items-center">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center px-4 py-2 text-white font-semibold rounded-2xl transition duration-300 ease-in-out 
            ${hasLiked === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600'}`}
          >
            <FaThumbsUp className="mr-1" /> {likesCount}
          </button>
        </div>
        {/* Dislike Button */}
        <div className="mx-2 flex items-center">
          <button
            onClick={handleDislikeToggle}
            className={`flex items-center px-4 py-2 text-white font-semibold rounded-2xl transition duration-300 ease-in-out 
            ${hasLiked === 2 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 hover:bg-gray-600'}`}
          >
            <FaThumbsDown className="mr-1" /> {dislikesCount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfo;
