import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "Product",
  initialState: {
    search: "",
  },
  reducers: {
    setProduct: (state, action: PayloadAction<any>) => {
      state.search = action.payload;
    },
  },
});

export const { setProduct } = productSlice.actions;
export default productSlice.reducer;
