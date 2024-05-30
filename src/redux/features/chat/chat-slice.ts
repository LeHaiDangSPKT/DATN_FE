import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const chatSlice = createSlice({
    name: "chatSlice",
    initialState: {
        socketChat: null,
    },
    reducers: {
        saveSocketChat: (state, action: PayloadAction<any>) => {
            state.socketChat = action.payload;
        }
    }
})

export const { saveSocketChat } = chatSlice.actions
export default chatSlice.reducer