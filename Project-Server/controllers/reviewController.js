import Review from "../models/reviewModel.js";
import Product from "../models/productModels.js";

export const createReview = async (req, res) => {
  try {
    const { productID, rating, comment } = req.body;
    if (!req.user) return res.status(401).json({ success: false, error: "Please login first" });
    if (!rating || !comment) return res.status(400).json({ success: false, error: "Rating and comment required" });
    const productExists = await Product.findById(productID);
    if (!productExists) return res.status(404).json({ success: false, error: "Product not found" });
    const existingReview = await Review.findOne({ user: req.user._id, productID });
    if (existingReview)
      return res.status(400).json({ success: false, error: "You already reviewed this product" });
    const newReview = await Review.create({
      user: req.user._id,
      productID,
      rating,
      comment,
    });
    const reviews = await Review.find({ productID });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productID, { rating: avgRating });
    res.status(201).json({ success: true, data: { message: "Review created successfully", review: newReview } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productID } = req.params;
    const productExists = await Product.findById(productID);
    if (!productExists) return res.status(404).json({ success: false, error: "Product not found" });
    const reviews = await Review.find({ productID }).populate("user", "name email");
    if (reviews.length === 0)
      return res.status(404).json({ success: false, error: "No reviews found for this product" });
    res.status(200).json({ success: true, data: { reviews } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewID } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findById(reviewID);
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });
    review.rating = rating;
    review.comment = comment;
    await review.save();
    const reviews = await Review.find({ productID: review.productID });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(review.productID, { rating: avgRating });
    res.status(200).json({ success: true, data: { message: "Review updated", review } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review) return res.status(404).json({ success: false, error: "Review not found" });
    if (review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, error: "Not authorized" });
    await review.deleteOne();
    const remaining = await Review.find({ productID: review.productID });
    const avgRating =
      remaining.length > 0
        ? remaining.reduce((acc, r) => acc + r.rating, 0) / remaining.length
        : 0;
    await Product.findByIdAndUpdate(review.productID, { rating: avgRating });
    res.status(200).json({ success: true, data: { message: "Review deleted" } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
