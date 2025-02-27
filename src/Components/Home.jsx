import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../Context/LoginContext';
import { SearchContext } from '../Context/SearchContext';
import { getAllVideos } from '../Utilis/GetAllVideosService';
import VideoCard from './Video/VideoCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spotlight from '../Context/Spotlight';
import RollingGallery from '../Utilis/RollingGallery';

const Home = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const { Searchquery, setSearchquery } = useContext(SearchContext);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Reset search query on page load/refresh
  useEffect(() => {
    setSearchquery('');
    return () => {
      setVideos([]);
      setPage(1);
    };
  }, []);

  const fetchVideos = useCallback(async (pageNumber, searchQuery) => {
    console.log(pageNumber,"jhhhhhhhhhhhh")
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getAllVideos(pageNumber, 12, searchQuery || '');
      const fetchedVideos = response.data;

      if (!Array.isArray(fetchedVideos)) {
        throw new Error('Invalid response format');
      }

      setVideos(prevVideos => {
        if (pageNumber === 1) {
          return fetchedVideos;
        }
        
        const newVideos = fetchedVideos.filter(
          newVideo => !prevVideos.some(prevVideo => prevVideo._id === newVideo._id)
        );
        
        return [...prevVideos, ...newVideos];
      });

      setHasMore(fetchedVideos.length > 0);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('Failed to load videos. Please try again later.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    fetchVideos(1, Searchquery);
  }, [Searchquery, fetchVideos]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVideos(nextPage, Searchquery);
    }
  };

  const handleRetry = () => {
    setError(null);
    setPage(1);
    fetchVideos(1, Searchquery);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lime-600">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Spotlight spotlightSize="50" spotlightColor="black" >
    <div className="bg-[rgb(25,25,25)] min-h-screen ">
      {/* <div className=" fixed  w-full overflow-hidden bg-gradient-to-r from-yellow-50 to-yellow-100 z-10 pt-4">
           <RollingGallery videos={videos} autoplay={true} pauseOnHover={true}  />
      </div> */}
      <InfiniteScroll
        dataLength={videos.length}
        next={loadMore}
        hasMore={hasMore}
        className=''
        loader={
          <div className="flex justify-center p-4 ">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        endMessage={
          videos.length > 0 ? (
            <p className="text-center text-gray-500 p-4">
              You've reached the end!
            </p>
          ) : null
        }
      >
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 mx-auto max-w-full">
          {videos.map((video) => (
            <VideoCard 
              key={video._id} 
              video={video} 
              cardSize="w-full" 
              background="bg-transparent"
            />
          ))}
        </div>

        {videos.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 p-4">
            {Searchquery ? 'No videos found matching your search.' : 'No videos available.'}
          </div>
        )}
      </InfiniteScroll>
    </div>
    </Spotlight>
  );
};

export default Home;


