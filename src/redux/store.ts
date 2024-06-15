import { configureStore } from "@reduxjs/toolkit"
import cartPopupReducer from "./features/cart/cartpopup-slice"
import categoryStoreReducer from "./features/categoryStore/categoryStore-slice"
import productReducer from "./features/product/product-slice"
import chatReducer from "./features/chat/chat-slice"
import searchReducer from "./features/search/search-slice"
import uploadFilesReducer from "./features/UploadFiles/upload-file-slices"
import { TypedUseSelectorHook, useSelector } from "react-redux"
export const store = configureStore({
    reducer: {
        cartPopupReducer,
        categoryStoreReducer,
        productReducer,
        chatReducer,
        searchReducer,
        uploadFilesReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
