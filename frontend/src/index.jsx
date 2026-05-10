import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import store from './slices/index.js';
import { addMessage } from './slices/messagesSlice';
import { addChannels, renameChannel, removeChannel } from './slices/channelsSlice';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

const socket = io();
socket.on('newMessage', (payload) => {
  store.dispatch(addMessage(payload));
});
socket.on('newChannel', (payload) => {
  store.dispatch(addChannels([payload]));
});
socket.on('renameChannel', (payload) => {
  store.dispatch(renameChannel(payload));
});
socket.on('removeChannel', (payload) => {
  store.dispatch(removeChannel(payload.id));
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </StrictMode>,
)
