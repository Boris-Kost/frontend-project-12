import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice.js';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import modalReducer from './modalSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
  },
});
