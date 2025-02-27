import React, { useState, useEffect, useContext } from 'react';
import { uploadComment, GetVideoComment, deleteComment, updateComment } from '../Utilis/CommentService';
import { getUserData } from '../Utilis/GetUserDataService';
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../Utilis/TimeFormatingUtil';
import { LoginContext } from '../Context/LoginContext';

const CommentSection = ({ video }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const { currentUserId } = useContext(LoginContext);

  const videoId = video?._id;

  const fetchComments = async (pageNumber) => {
    if (!hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = { page: pageNumber, limit: 5 };
      const response = await GetVideoComment(videoId, queryParams);

      const fetchedComments = response?.comments || [];
      const totalComments = response?.totalCount || 0;

      setComments((prevComments) => {
        const newComments = fetchedComments.filter(
          (newComment) => !prevComments.some((prevComment) => prevComment._id === newComment._id)
        );
        return [...prevComments, ...newComments];
      });

      setHasMore(fetchedComments.length > 0 && (pageNumber * queryParams.limit < totalComments));

      fetchedComments.forEach(async (comment) => {
        if (!userCache[comment.owner]) {
          const userData = await getUserData(localStorage.getItem('authToken'), comment.owner);
          setUserCache((prev) => ({ ...prev, [comment.owner]: userData }));
        }
      });

    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchComments(page);
    }
  }, [videoId, page]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    const commentData = {
      content: comment,
      video: videoId,
    };

    try {
      const response = await uploadComment(commentData);

      if (response) {
        const newComment = response.data;

        setComments((prevComments) => [newComment, ...prevComments]);

        if (!userCache[newComment.owner]) {
          const userData = await getUserData(localStorage.getItem('authToken'), newComment.owner);
          setUserCache((prev) => ({ ...prev, [newComment.owner]: userData }));
        }

        setComment('');
      } else {
        throw new Error('Failed to upload comment.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to upload comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setLoading(true);
      await deleteComment(commentId);

      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditedCommentContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditedCommentContent('');
  };

  const handleEditSubmit = async (commentId) => {
    if (!editedCommentContent.trim()) {
      return;
    }

    try {
      setLoading(true);
      await updateComment(commentId, { content: editedCommentContent });

      setComments((prevComments) => 
        prevComments.map((comment) => 
          comment._id === commentId ? { ...comment, content: editedCommentContent } : comment
        )
      );

      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (err) {
      setError('Failed to update comment.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreComments = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="comment-section text-white bg-transparent backdrop-blur-lg p-4 rounded-lg shadow-lg border border-transparent">
      <h2 className="text-lg font-semibold mb-4 text-white">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={comment}
          onChange={handleInputChange}
          placeholder="Write a comment..."
          className="w-full border border-gray-300 rounded p-2 mb-2 text-gray-100 bg-gray-500 bg-opacity-80"
          rows="2"
          required  
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <InfiniteScroll
        dataLength={comments.length}
        next={fetchMoreComments}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>No more comments to display</b>
          </p>
        }
      >
        <ul className="comment-list">
          {comments.length > 0 ? comments.map((comment) => (
            <li key={comment._id} className="mb-4 p-2 border-b border-gray-300 flex items-start">
              <Link to={`/channel/${userCache[comment.owner]?.username}`} state={{owner:userCache[comment.owner]}} className="mr-3">
                <img
                  src={userCache[comment.owner]?.avatar || '/default-avatar.png'}
                  alt={`${userCache[comment.owner]?.username || 'User'}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/channel/${userCache[comment.owner]?.username}`} state={{owner:userCache[comment.owner]}} className=" font-bold hover:underline text-xs">
                  @{userCache[comment.owner]?.username || 'Loading...'} 
                </Link>
                
                {editingCommentId === comment._id ? (
                  <div className="mt-2">
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 mb-2 text-gray-100 bg-gray-500 bg-opacity-80"
                      rows="2"
                      required
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSubmit(comment._id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white">{comment.content || 'No content available'}</p>
                )}
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-400 text-xs">
                    {comment.updatedAt && comment.updatedAt !== comment.createdAt
                      ? `Updated ${formatRelativeTime(comment.updatedAt)}`
                      : ` ${formatRelativeTime(comment.createdAt)}`}
                  </span>
                  {currentUserId === comment.owner && !editingCommentId && (
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-400 hover:underline text-xs"
                        onClick={() => handleEditStart(comment)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 hover:underline text-xs"
                        onClick={() => handleDelete(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          )) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default CommentSection;
