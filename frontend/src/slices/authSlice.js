import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')).token : null,
  username: localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')).username : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action) => {
      const { token, username } = action.payload;
      state.token = token;
      state.username = username;
      localStorage.setItem('userId', JSON.stringify({ token, username }));
    },
    logOut: (state) => {
      state.token = null;
      state.username = null;
      localStorage.removeItem('userId');
    },
  },
});

export const { logIn, logOut } = authSlice.actions;

export default authSlice.reducer;
