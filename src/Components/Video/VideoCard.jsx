import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from '../../Context/LoginContext';
import { getUserData } from '../../Utilis/GetUserDataService';
import { formatRelativeTime } from "../../Utilis/TimeFormatingUtil";

const VideoCard = ({ video, className = "", cardSize = "", background = "bg-transparent" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState('');

  const { videoFile, thumbnail, title, duration, views, owner: ownerId, createdAt } = video;
  const formattedDuration = `${Math.floor(duration / 60)}:${('0' + Math.floor(duration % 60)).slice(-2)}`;
  const { isLoggedIn } = useContext(LoginContext);
  const token = localStorage.getItem('authToken');
  const uploadAt = formatRelativeTime(createdAt);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      try {
        const ownerData = await getUserData(token, ownerId);
        setOwner(ownerData);
      } catch (err) {
        console.error('Error fetching owner data:', err);
        setError('Failed to load owner profile');
      }
    };

    if (ownerId) {
      fetchOwnerProfile();
    }
  }, [ownerId, token]);

  return (
    <div
      className={`${cardSize} ${background} ${className} rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg border border-black hover:border-black`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full aspect-video bg-gray-800">
        <Link to={`/video/${encodeURIComponent(title)}`} state={{ video, owner }}>
          {isHovered ? (
            <video
              src={videoFile}
              muted
              autoPlay
              loop
              className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover rounded-t-lg transition-opacity duration-300"
            />
          )}
        </Link>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-0.5 rounded-md">
          {formattedDuration}
        </span>
      </div>

      <div className="flex mt-3 px-3 pb-3">
        {error ? (
          <span className="text-red-500 text-xs">Error loading owner</span>
        ) : owner ? (
          <Link to={`/channel/${owner.username}`} state={{ owner }} className="flex-shrink-0">
            <img
              src={owner.avatar}
              alt={`${owner.username}'s avatar`}
              className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700 hover:border-white transition-all"
            />
          </Link>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse mr-3"></div>
        )}

        <div className="flex flex-col justify-center w-full">
          <Link to={`/video/${encodeURIComponent(title)}`} state={{ video, owner }}>
            <h3 className="text-white text-lg font-semibold truncate hover:underline" title={title}>
              {title}
            </h3>
          </Link>

          {owner && (
            <Link to={`/channel/${owner.username}`} state={{ owner }} className="text-white text-xs hover:text-white transition-all">
              {owner.username}
            </Link>
          )}

          <div className="text-white text-xs flex items-center mt-1">
            <span>{views.toLocaleString()} views</span>
            <span className="mx-2">•</span>
            <span>{uploadAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
