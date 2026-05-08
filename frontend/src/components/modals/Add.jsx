import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { closeModal } from '../../slices/modalSlice';
import { setCurrentChannelId, selectors as channelsSelectors } from '../../slices/channelsSlice';

const Add = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const channels = useSelector(channelsSelectors.selectAll);
  const channelNames = channels.map((c) => c.name);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .required('Обязательное поле')
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов')
        .notOneOf(channelNames, 'Должно быть уникальным'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/v1/channels', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCurrentChannelId(response.data.id));
        dispatch(closeModal());
      } catch (err) {
        console.error('Add channel error:', err);
      }
    },
  });

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
            <Form.Control
              ref={inputRef}
              id="name"
              name="name"
              required
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              disabled={formik.isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" className="me-2" onClick={() => dispatch(closeModal())}>Отменить</Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>Отправить</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
