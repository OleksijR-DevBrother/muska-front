import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../types/user.interface';
import { Language } from '../../localization';

const slice = createSlice({
  name: 'user slice',
  initialState: {
    accessToken: '',
    refreshToken: '',
    role: '',
    language: Language.ENGLISH,
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
      if (action.payload.language !== undefined) {
        state.language = action.payload.language;
      }
    },
  },
});

export const reducer = slice.reducer;

export const { updateUser } = slice.actions;
