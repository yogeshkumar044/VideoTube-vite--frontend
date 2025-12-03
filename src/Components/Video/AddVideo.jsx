import React, { useState } from 'react';
import { uploadVideo } from '../../Utilis/VideoService';
import { Upload, FileVideo, Image, Type, AlignLeft, Video } from 'lucide-react';

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
      alert('Video uploaded successfully!');
    } catch (err) {
      console.error('Video upload failed:', err);
      setError('Video upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <Upload className="w-12 h-12 text-red-500 mr-2" />
            <h2 className="text-3xl font-bold text-white">Add Video</h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAddVideo} className="space-y-4">
            {/* Video File Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileVideo className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600 cursor-pointer"
                required
              />
            </div>

            {/* Thumbnail Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600 cursor-pointer"
                required
              />
            </div>

            {/* Title Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video Title"
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Description Input */}
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <AlignLeft className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video Description"
                rows="4"
                className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Video className="w-5 h-5 animate-pulse" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Video</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddVideo;
