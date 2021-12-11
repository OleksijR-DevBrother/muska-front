import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../types/user.interface';

const slice = createSlice({
  name: 'user slice',
  initialState: {
    accessToken: '',
    refreshToken: '',
    role: '',
  } as User,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (action.payload.accessToken !== undefined) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.role !== undefined) {
        state.role = action.payload.role;
      }
    },
  },
});

export const reducer = slice.reducer;

export const { updateUser } = slice.actions;
