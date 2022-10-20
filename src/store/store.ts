import { combineReducers, configureStore, Reducer, CombinedState } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import { PersistConfig, Persistor } from 'reduxjs-toolkit-persist/lib/types';
import { logSlice, logSliceName } from './Log';

const persistConfig:PersistConfig<any> = {
  key: '@accessitech/tracker',
  storage,
};

const reducers: Reducer<CombinedState<any>> = combineReducers({
  [logSliceName]: logSlice.reducer,
});

const persistedReducer: Reducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  }),
});

export const persistor: Persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
