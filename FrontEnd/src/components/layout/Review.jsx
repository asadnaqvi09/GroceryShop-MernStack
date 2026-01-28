import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
} from "../../redux/features/reviews/reviewSlice";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Clock, MoreHorizontal, Edit, Trash } from "lucide-react";

// Utility function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

function Review({ productId }) {
  const dispatch = useDispatch();
  const { reviews, loading: reviewLoading } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [isDropdownOpen,setIsDropdownOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  useEffect(() => {
    if (productId) dispatch(getReviewsByProduct(productId));
  }, [dispatch, productId]);

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!rating || !comment) {
      toast.error("Please provide both rating and comment");
      return;
    }
    const response = await dispatch(
      createReview({ productID: productId, rating, comment })
    );
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Review submitted successfully");
      setComment("");
      setRating(0);
      setHoveredRating(0);
      dispatch(getReviewsByProduct(productId));
    } else {
      toast.error(response.payload?.message || "Error submitting review");
    }
  };

  const handleLike = (reviewId) => {
    if (!user) {
      toast.error("Please login to like");
      return;
    }
    setUserLikes((prev) => {
      const isLiked = prev[reviewId];
      setLikes((prevLikes) => ({
        ...prevLikes,
        [reviewId]: (prevLikes[reviewId] || 0) + (isLiked ? -1 : 1),
      }));
      return { ...prev, [reviewId]: !isLiked };
    });
  };

  const startEditing = (review) => {
    setEditingReview(review._id);
    setEditedComment(review.comment);
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editedComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    const response = await dispatch(
      updateReview({ reviewId, comment: editedComment })
    );
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Review updated successfully");
      setEditingReview(null);
      dispatch(getReviewsByProduct(productId));
    } else {
      toast.error(response.payload?.message || "Error updating review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const response = await dispatch(deleteReview(reviewId));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success("Review deleted successfully");
      dispatch(getReviewsByProduct(productId));
    } else {
      toast.error(response.payload?.message || "Error deleting review");
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
      
      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {reviewLoading ? (
          <p className="text-gray-500 text-center">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                    {review.user?.name
                      ? review.user.name.charAt(0).toUpperCase()
                      : "A"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-1 cursor-pointer">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 text-center">
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(review.createdAt)}
                        </p>
                        {user && review.user?._id === user._id && (
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-gray-500 hover:text-gray-700 cursor-pointer p-1"
                              onClick={()=> setIsDropdownOpen((prev)=> !prev)}
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </motion.button>
                            <AnimatePresence>
                              {isDropdownOpen && (
                                <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10"
                              >
                                <button
                                  onClick={() => startEditing(review)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReview(review._id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                >
                                  <Trash className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>
                    {editingReview === review._id ? (
                      <div className="mt-2">
                        <textarea
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          className="w-full border rounded-lg p-3 bg-white/50 focus:ring-2 focus:ring-green-400 outline-none transition-all"
                          rows={3}
                        ></textarea>
                        <div className="flex justify-end gap-2 mt-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingReview(null)}
                            className="px-4 py-1 text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateReview(review._id)}
                            className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                          >
                            Save
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 px-16 text-sm text-gray-600">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(review._id)}
                    className="flex items-center gap-1 hover:text-green-600 cursor-pointer"
                  >
                    {userLikes[review._id] ? (
                      <ThumbsDown className="w-4 h-4" />
                    ) : (
                      <ThumbsUp className="w-4 h-4" />
                    )}
                    {likes[review._id] || 0} Like{likes[review._id] !== 1 ? "s" : ""}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No reviews yet — be the first to write one!
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Rating:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <Star
                    className={`w-6 h-6 cursor-pointer ${
                      i < (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg p-3 bg-white/50 focus:ring-2 focus:ring-green-400 outline-none transition-all"
            placeholder="Share your thoughts about the product..."
            rows={4}
          ></textarea>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReviewSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Submit Review
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Review;