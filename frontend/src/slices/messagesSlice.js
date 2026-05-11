import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const messagesAdapter = createEntityAdapter()

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
})

export const { addMessages, addMessage } = messagesSlice.actions
export const selectors = messagesAdapter.getSelectors(state => state.messages)
export default messagesSlice.reducer
