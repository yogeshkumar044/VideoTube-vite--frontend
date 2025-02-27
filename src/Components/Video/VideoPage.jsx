import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LoginContext } from '../../Context/LoginContext';
import CommentSection from '../Comments';
import OwnerInfo from './UserChannelLink';
import { formatRelativeTime } from '../../Utilis/TimeFormatingUtil';
import { incrementViewCount } from '../../Utilis/ViewsService';
import { getVideoById } from '../../Utilis/GetVideoByIdService';

const VideoPage = () => {
  const { title } = useParams();
  const location = useLocation();
  const { isLoggedIn, currentUserId } = useContext(LoginContext);
  const initialVideo = location.state?.video;
  const initialOwner = location.state?.owner;

  const [videoData, setVideoData] = useState(initialVideo);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [viewIncremented, setViewIncremented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const viewIncrementedRef = useRef(false);

  // Fetch latest video data when component mounts
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!initialVideo?._id) return;

      try {
        setIsLoading(true);
        const freshVideoData = await getVideoById(initialVideo._id);
        if (freshVideoData) {
          setVideoData(freshVideoData);
        }
      } catch (err) {
        console.error('Failed to fetch video details:', err);
        setError('Failed to load video data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [initialVideo?._id]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('User is not logged in. Redirecting to login page...');
      // navigate('/login');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      viewIncrementedRef.current = false;
    };
  }, []);

  if (!isLoggedIn) {
    return <p className="text-gray-400 text-center">Please log in to view this content.</p>;
  }

  if (isLoading) {
    return <p className="text-gray-400 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-gray-400 text-center">{error}</p>;
  }

  if (!videoData) {
    return <p className="text-gray-400 text-center">Video not found.</p>;
  }

  const { videoFile, title: videoTitle, duration, description, createdAt, _id: videoId, views } = videoData;

  const formattedDuration = (duration / 60).toFixed(2);
  const uploadedAT = formatRelativeTime(createdAt);

  const handleToggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const truncatedDescription = showFullDescription 
    ? description 
    : description.split('\n')[0];

  const handleTimeUpdate = async () => {
    if (videoRef.current && !viewIncrementedRef.current) {
      const currentTime = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;

      if (currentTime >= videoDuration * 0.05) {
        try {
          viewIncrementedRef.current = true;
          
          const viewData = await incrementViewCount(videoId, currentUserId);

          if (!viewData) {
            console.error('Failed to increment view count.');
            return;
          }

          setVideoData(prevData => ({
            ...prevData,
            views: viewData.views
          }));
          
          setViewIncremented(true);
        } catch (error) {
          console.error('Error incrementing view count:', error);
          viewIncrementedRef.current = false;
        }
      }
    }
  };

  return (
    <div className="bg-transparent h-screen text-white flex justify-center  mt-4">
      <div className="flex w-full max-w-screen-2xl mx-auto bg-transparent">
        <div className="flex-1 pl-8 pr-8 w-9/12 space-y-0.5 bg-transparent">
          <div className="w-full h-auto rounded-2xl shadow-md mb-0.5">
            <video
              ref={videoRef}
              src={videoFile}
              controls
              autoPlay
              className="w-full h-auto object-contain rounded-lg shadow-lg border border-black"
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          <div className="bg-transparent rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-2">{videoTitle}</h2>
            <OwnerInfo owner={initialOwner} video={videoData} />
          </div>

          <div className="bg-gray-800 p-3 rounded-md mb-4">
            <h2 className="text-sm font-medium mb-2">
              {views} Views <span className="mr-2 ml-2">|</span> {uploadedAT}
            </h2>
            <p className="text-gray-300 mb-2">
              {truncatedDescription}
              {!showFullDescription && description.length > truncatedDescription.length && (
                <span 
                  className="text-blue-400 cursor-pointer hover:underline" 
                  onClick={handleToggleDescription}
                >
                  {' '}...more
                </span>
              )}
            </p>
            {showFullDescription && (
              <p className="text-gray-300 mb-2">
                {description.split('\n').slice(1).join('\n')}
                <span 
                  className="text-blue-400 cursor-pointer hover:underline" 
                  onClick={handleToggleDescription}
                >
                  {' '}...less
                </span>
              </p>
            )}
          </div>

          <div className="bg-transparent p-3 rounded-md mb-0">
            <CommentSection video={videoData} />
          </div>
        </div>

        <div className="w-3/12 bg-transparent pr-24 mr-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
          <div className="space-y-2">
            <div className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition duration-200">
              <p className="text-gray-300">Related video 1</p>
            </div>
            <div className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition duration-200">
              <p className="text-gray-300">Related video 2</p>
            </div>
            <div className="bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition duration-200">
              <p className="text-gray-300">Related video 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;