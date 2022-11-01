import { createSlice } from '@reduxjs/toolkit';

const currency = localStorage.getItem('selected-currency') || '';

export const currencySlice = createSlice({
   name: 'currency',
   initialState: currency,
   reducers: {
      setCurrency: (state, { payload }) => {
         localStorage.setItem('selected-currency', payload);
         return payload;
      }
   }
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
