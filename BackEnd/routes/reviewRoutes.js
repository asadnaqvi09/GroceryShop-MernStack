import express from "express";
import {
    createReview,
    getReviews,
    deleteReview,
    updateReview
} from '../controllers/reviewController.js';
import {protectedRoute} from '../middlewares/protectedRoute.js';
const Router = express.Router();

Router.post('/create', protectedRoute ,createReview);
Router.get('/:productID', getReviews);
Router.delete('/:reviewID', protectedRoute ,deleteReview);
Router.put('/:reviewID', protectedRoute ,updateReview);

export default Router;