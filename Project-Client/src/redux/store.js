import { configureStore } from "@reduxjs/toolkit";
import { cartSliceReducer } from "./features/cart/cartSlice";
import { authSliceReducer } from "./features/auth/authSlice";
import { productReducer } from './features/product/productSlice'
import { reviewReducer } from './features/reviews/reviewSlice'
import { addressReducer } from './features/address/addressSlice'
import { orderReducer } from './features/order/orderSlice'

const store = configureStore({
    reducer: {
        cart: cartSliceReducer,
        auth: authSliceReducer,
        product: productReducer,
        review: reviewReducer,
        address: addressReducer,
        order: orderReducer,
    },
});

export default store;