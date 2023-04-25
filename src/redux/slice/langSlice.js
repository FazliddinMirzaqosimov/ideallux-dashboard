import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: [],
  isLoading: false,
};

const LangSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    getLangSuccess: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    getLangsStart: (state) => {
      state.isLoading = true;
    },
  },
});

// export const selectAllPosts = (state) => state.posts;

export const {getLangSuccess, getLangsStart} = LangSlice.actions;

export default LangSlice.reducer;
