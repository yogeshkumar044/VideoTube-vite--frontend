import React, { useEffect, useState } from 'react';
import { getWatchedHistory } from '../Utilis/GetWatchedHistoryService';
import VideoCard from './Video/VideoCard';
import { Loader2 } from 'lucide-react';

export default function History() {
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalWatchedVideos, setTotalWatchedVideos] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchWatchedHistory = async () => {
      try {
        const { watchHistory, totalWatchedVideos } = await getWatchedHistory(page, limit);
        setWatchedVideos(watchHistory);
        setTotalWatchedVideos(totalWatchedVideos);
        setLoading(false);
      } catch (err) {
        setError('Failed to load watched history');
        setLoading(false);
      }
    };

    fetchWatchedHistory();
  }, [page]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-l-gray-950 px-60 bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Watch History
          <span className="text-sm font-normal text-white ml-2">
            ({totalWatchedVideos} {totalWatchedVideos === 1 ? 'video' : 'videos'})
          </span>
        </h1>

        {watchedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 shadow-sm ">
            <p className="text-lg text-gray-600">No watched videos found.</p>
            <p className="mt-2 text-sm text-gray-500">Videos you watch will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-20">
            {watchedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}

        {totalWatchedVideos > limit && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {Math.ceil(totalWatchedVideos / limit)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= totalWatchedVideos}
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}