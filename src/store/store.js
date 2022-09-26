import { configureStore } from '@reduxjs/toolkit';
import { logSlice, logSliceName } from './Log';

export default configureStore({
  reducer: {
    [logSliceName]: logSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
