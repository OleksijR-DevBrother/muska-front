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
      if (action.payload.id !== undefined) {
        state.id = action.payload.id;
      }
      if (action.payload.name !== undefined) {
        state.name = action.payload.name;
      }
      if (action.payload.surname !== undefined) {
        state.surname = action.payload.surname;
      }
      if (action.payload.patronymic !== undefined) {
        state.patronymic = action.payload.patronymic;
      }
      if (action.payload.DOB !== undefined) {
        state.DOB = action.payload.DOB;
      }
      if (action.payload.username !== undefined) {
        state.username = action.payload.username;
      }
    },
  },
});

export const reducer = slice.reducer;

export const { updateUser } = slice.actions;
