import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: "",
  },
  reducers: {
    setParamSearch: (state, action: PayloadAction<any>) => {
      state.search = action.payload;
    },
  },
});

export const { setParamSearch } = searchSlice.actions;
export default searchSlice.reducer;
