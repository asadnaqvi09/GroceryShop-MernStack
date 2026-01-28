import { configureStore } from "@reduxjs/toolkit";
import { cartSliceReducer } from "./features/cart/cartSlice";
import { authSliceReducer } from "./features/auth/authSlice";
import { productReducer } from './features/product/productSlice'
import { reviewReducer } from './features/reviews/reviewSlice'

const store = configureStore({
    reducer: {
        cart: cartSliceReducer,
        auth: authSliceReducer,
        product: productReducer,
        review: reviewReducer,
    },
});

export default store;