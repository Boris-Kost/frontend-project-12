import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { closeModal } from '../../slices/modalSlice';
import { selectors as channelsSelectors } from '../../slices/channelsSlice';

const Rename = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const { item: channelId } = useSelector((state) => state.modal);
  
  const channel = useSelector((state) => channelsSelectors.selectById(state, channelId));
  const channels = useSelector(channelsSelectors.selectAll);
  const channelNames = channels.map((c) => c.name);

  useEffect(() => {
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  const formik = useFormik({
    initialValues: { name: channel.name },
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
        await axios.patch(`/api/v1/channels/${channelId}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(closeModal());
      } catch (err) {
        console.error('Rename channel error:', err);
      }
    },
  });

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
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

export default Rename;
