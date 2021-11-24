import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reducer as userReducer } from './slices/user.slice';

const rootReducer = persistReducer(
  {
    key: 'root',
    storage,
  },
  combineReducers({
    user: userReducer,
  }),
);

export const store = configureStore({
  reducer: rootReducer,
});

// store.subscribe(() => console.log(store.getState()));

type StateType = ReturnType<typeof store.getState>;
export const useStoreSelector: TypedUseSelectorHook<StateType> = useSelector;

type StoreDispatch = typeof store.dispatch;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStoreDispatch = () => useDispatch<StoreDispatch>();
