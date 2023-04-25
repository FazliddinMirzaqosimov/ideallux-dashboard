import {configureStore} from '@reduxjs/toolkit';
import AuthSlice from '../slice/authSlice';
import langSlice from 'redux/slice/langSlice';
import EditSlice from "../slice/editSlice";

export default configureStore({
  reducer: {
    auth: AuthSlice,
    langs: langSlice,
    edit:EditSlice
  },
  devTools: process.env.NODE_ENV !== 'production',
});
