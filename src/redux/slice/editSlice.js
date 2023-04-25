import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editArticle:'',
  editProduct:'',
  editCategory:''
};

export const EditSlice = createSlice({
  name:'edit',
  initialState,
  reducers:{
    articleEdit: (state,{payload}) => {
     state.editArticle=payload
    },
    productEdit: (state,{payload}) => {
      state.editProduct=payload
    },
    categoryEdit: (state,{payload}) => {
      state.editCategory=payload
    },
  }
});


export const {articleEdit,productEdit,categoryEdit}=EditSlice.actions
export default EditSlice.reducer