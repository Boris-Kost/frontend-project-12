import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { closeModal } from '../../slices/modalSlice';

const Remove = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { item: channelId } = useSelector((state) => state.modal);

  const handleRemove = async () => {
    setIsSubmitting(true);
    try {
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(closeModal());
    } catch (err) {
      console.error('Remove channel error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={() => dispatch(closeModal())} disabled={isSubmitting}>Отменить</Button>
          <Button variant="danger" onClick={handleRemove} disabled={isSubmitting}>Удалить</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
