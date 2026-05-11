import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  type: null,
  item: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.type = action.payload.type
      state.item = action.payload.item ?? null
    },
    closeModal: (state) => {
      state.type = null
      state.item = null
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
