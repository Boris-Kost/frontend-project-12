import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { addChannels, setCurrentChannelId, selectors as channelsSelectors } from '../slices/channelsSlice';
import { addMessages, selectors as messagesSelectors } from '../slices/messagesSlice';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector(messagesSelectors.selectAll);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [channelsResponse, messagesResponse] = await Promise.all([
          axios.get('/api/v1/channels', { headers }),
          axios.get('/api/v1/messages', { headers }),
        ]);

        dispatch(addChannels(channelsResponse.data));
        dispatch(addMessages(messagesResponse.data));
        
        if (channelsResponse.data.length > 0) {
          dispatch(setCurrentChannelId(channelsResponse.data[0].id));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [dispatch, token]);

  const currentChannelMessages = messages.filter((m) => m.channelId === currentChannelId);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
            <span>Каналы</span>
          </div>
          <ListGroup variant="flush" className="flex-column nav-pills nav-fill px-2">
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                action
                active={channel.id === currentChannelId}
                onClick={() => dispatch(setCurrentChannelId(channel.id))}
                className="w-100 rounded-0 text-start"
              >
                <span className="me-1">#</span>
                {channel.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {channels.find((c) => c.id === currentChannelId)?.name}</b>
              </p>
              <span className="text-muted">{currentChannelMessages.length} сообщений</span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {currentChannelMessages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b>{message.username}</b>: {message.body}
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              {/* Поле ввода сообщения будет здесь */}
              <div className="text-muted small">Здесь будет форма ввода...</div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
