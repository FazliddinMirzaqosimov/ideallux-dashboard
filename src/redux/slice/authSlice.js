import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  isLoading: false,
  error: null,
  displayMessage: null,
  user: {},
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.displayMessage = null;
    },
    signUserSuccess: (state, {payload}) => {
      state.isLoading = false;

      state.displayMessage = payload.status;
      state.loggedIn = true;
    },
    signUserFailure: (state) => {
      state.isLoading = false;
      state.error = 'error';
    },
    checkToken: (state) => {
      state.loggedIn = true;
    },
    logoutUser: (state) => {
      state.loggedIn = false;
    },
  },
});

export const {
  signUserStart,
  signUserFailure,
  signUserSuccess,
  checkToken,
  logoutUser,
} = AuthSlice.actions;
export default AuthSlice.reducer;
