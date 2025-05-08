import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "./CryptoSlice"; // This assumes CryptoSlice.js is in the same folder

const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
});

export default store;
