import { createSlice } from "@reduxjs/toolkit";
import { isEqual } from 'lodash';


const initialState = JSON.parse(localStorage.getItem('cart-items')) || [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProductToCart: (state, { payload }) => {
            let isProductInCart = false;
            for (const index in state) {
                if (isEqual(payload, state[index].productDetails)) {
                    state[index].quantity += 1;
                    isProductInCart = true;
                    break;
                }
            }
            if (!isProductInCart)
                state.push({
                    quantity: 1,
                    productDetails: payload
                });
            localStorage.setItem('cart-items', JSON.stringify(state));
            return state;
        },
        updateProduct: (state, { payload: { cartIndex, update } }) => {
            state[cartIndex] = update;
            localStorage.setItem('cart-items', JSON.stringify(state));
   
            return state;
        },
        removeProduct: (state, { payload: { cartIndex } }) => {
            state.splice(cartIndex, 1);
            localStorage.setItem('cart-items', JSON.stringify(state));
        },
        resetCart: (state) => {
            localStorage.removeItem('cart-items');
            return [];
        }
    }
});

export const { addProductToCart, updateProduct, removeProduct, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
