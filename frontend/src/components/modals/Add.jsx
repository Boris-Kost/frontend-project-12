import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { closeModal } from '../../slices/modalSlice';
import { setCurrentChannelId, selectors as channelsSelectors } from '../../slices/channelsSlice';

const Add = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const channels = useSelector(channelsSelectors.selectAll);
  const channelNames = channels.map((c) => c.name);
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .required(t('errors.required'))
        .min(3, t('errors.usernameLength'))
        .max(20, t('errors.usernameLength'))
        .notOneOf(channelNames, t('errors.unique')),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/v1/channels', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setCurrentChannelId(response.data.id));
        toast.success(t('toast.channelCreated'));
        dispatch(closeModal());
      } catch (err) {
        toast.error(t('toast.networkError'));
        console.error('Add channel error:', err);
      }
    },
  });

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label className="visually-hidden" htmlFor="name">{t('modals.channelName')}</Form.Label>
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
            <Button variant="secondary" className="me-2" onClick={() => dispatch(closeModal())}>{t('modals.cancel')}</Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>{t('modals.submit')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
