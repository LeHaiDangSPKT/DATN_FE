
import Home from "@/app/shop/seller/[MyStore]/Home";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
export const categoryStoreSlice = createSlice({
    name: "categoryStore",
    initialState: {
        items: {
            title: "Trang chủ",
            value: "home",
            element: Home,
        },
    },
    reducers: {
        setCategoryStore: (state, action: PayloadAction<any>) => {
            state.items = action.payload;
        },

    }
})


export const { setCategoryStore } = categoryStoreSlice.actions
export default categoryStoreSlice.reducer
