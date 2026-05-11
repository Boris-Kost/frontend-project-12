import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const channelsAdapter = createEntityAdapter()

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ currentChannelId: null }),
  reducers: {
    addChannels: channelsAdapter.addMany,
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload
    },
    renameChannel: (state, { payload }) => {
      channelsAdapter.updateOne(state, { id: payload.id, changes: { name: payload.name } })
    },
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload)
      if (state.currentChannelId === payload) {
        const defaultChannel = Object.values(state.entities).find(c => c.name === 'general')
        state.currentChannelId = defaultChannel ? defaultChannel.id : state.ids[0]
      }
    },
  },
})

export const { addChannels, setCurrentChannelId, renameChannel, removeChannel } = channelsSlice.actions
export const selectors = channelsAdapter.getSelectors(state => state.channels)
export default channelsSlice.reducer
