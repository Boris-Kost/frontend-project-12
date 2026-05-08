import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, ListGroup, Form, Button, InputGroup, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addChannels, setCurrentChannelId, selectors as channelsSelectors } from '../slices/channelsSlice';
import { addMessages, selectors as messagesSelectors } from '../slices/messagesSlice';
import { openModal } from '../slices/modalSlice';
import ModalManager from '../components/modals/ModalManager';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { token, username } = useSelector((state) => state.auth);
  const messagesBoxRef = useRef();
  
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector(messagesSelectors.selectAll);

  // Автопрокрутка вниз при новых сообщениях
  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTo(0, messagesBoxRef.current.scrollHeight);
    }
  }, [messages]);

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

  const formik = useFormik({
    initialValues: { body: '' },
    validationSchema: yup.object({
      body: yup.string().trim().required(),
    }),
    onSubmit: async (values, { resetForm }) => {
      const message = {
        body: values.body,
        channelId: currentChannelId,
        username,
      };
      try {
        await axios.post('/api/v1/messages', message, {
          headers: { Authorization: `Bearer ${token}` },
        });
        resetForm();
      } catch (err) {
        console.error('Send error:', err);
      }
    },
  });

  const currentChannelMessages = messages.filter((m) => m.channelId === currentChannelId);
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <ModalManager />
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
            <b>Каналы</b>
            <Button variant="group-vertical" className="p-0 text-primary" onClick={() => dispatch(openModal({ type: 'adding' }))}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path></svg>
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <ListGroup variant="flush" className="flex-column nav-pills nav-fill px-2">
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                as="li"
                className="w-100 rounded-0 text-start p-0"
              >
                <Dropdown as={ButtonGroup} className="w-100 d-flex">
                  <Button
                    variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                    className="w-100 rounded-0 text-start text-truncate"
                    onClick={() => dispatch(setCurrentChannelId(channel.id))}
                  >
                    <span className="me-1">#</span>
                    {channel.name}
                  </Button>
                  {channel.removable && (
                    <>
                      <Dropdown.Toggle split variant={channel.id === currentChannelId ? 'secondary' : 'light'} className="rounded-0 text-dark">
                        <span className="visually-hidden">Управление каналом</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => dispatch(openModal({ type: 'removing', item: channel.id }))}>Удалить</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatch(openModal({ type: 'renaming', item: channel.id }))}>Переименовать</Dropdown.Item>
                      </Dropdown.Menu>
                    </>
                  )}
                </Dropdown>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># {currentChannel?.name}</b>
              </p>
              <span className="text-muted">{currentChannelMessages.length} сообщений</span>
            </div>
            <div id="messages-box" ref={messagesBoxRef} className="chat-messages overflow-auto px-5">
              {currentChannelMessages.map((message) => (
                <div key={message.id} className="text-break mb-2">
                  <b>{message.username}</b>: {message.body}
                </div>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
                <InputGroup hasValidation>
                  <Form.Control
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2"
                    onChange={formik.handleChange}
                    value={formik.values.body}
                    disabled={formik.isSubmitting}
                  />
                  <Button type="submit" variant="group-vertical" disabled={formik.isSubmitting || !formik.values.body.trim()}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path></svg>
                    <span className="visually-hidden">Отправить</span>
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
