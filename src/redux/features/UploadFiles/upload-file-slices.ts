import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const uploadFiles = createSlice({
    name: "uploadFiles",
    initialState: {
        arr: [] as number[],
    },
    reducers: {
        addIndex: (state, action: PayloadAction<number>) => {
            if (state.arr.includes(action.payload)) {
                state.arr = state.arr.filter((item) => item !== action.payload)
            } else {
                state.arr.push(action.payload)
            }
        }
    }
})

export const { addIndex } = uploadFiles.actions
export default uploadFiles.reducer