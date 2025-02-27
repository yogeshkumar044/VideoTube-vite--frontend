import React, { useState } from 'react';
import { uploadVideo } from '../../Utilis/VideoService';

function AddVideo() {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      setError('Please select a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!videoFile || !thumbnail || !title.trim() || !description.trim()) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const videoData = new FormData();
    videoData.append('video', videoFile);
    videoData.append('thumbnail', thumbnail);
    videoData.append('title', title);
    videoData.append('description', description);

    try {
      const response = await uploadVideo(videoData);
      console.log('Video uploaded successfully:', response);
      // Reset fields after successful upload
      setVideoFile(null);
      setThumbnail(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Video upload failed:', err);
      setError('Video upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-900 border-4 border-blue-900 rounded-2xl hover:border-blue-500 transition-all duration-200 p-6 w-full max-w-md">
        <h2 className="text-white text-2xl mb-6 text-center">Add Video</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleAddVideo} className="space-y-4">
          <div>
            <label htmlFor="videoFile" className="block text-white font-medium mb-2">Video File</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-white font-medium mb-2">Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-white font-medium mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-white font-medium mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full p-2 bg-blue-900 rounded-md border border-gray-700 focus:border-blue-700 hover:border-blue-500 transition-all duration-200 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 ${loading ? 'disabled' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVideo;
