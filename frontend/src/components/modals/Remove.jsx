import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import axios from 'axios'
import { closeModal } from '../../slices/modalSlice'

const Remove = () => {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useSelector(state => state.auth)
  const { item: channelId } = useSelector(state => state.modal)
  const { t } = useTranslation()

  const handleRemove = async () => {
    setIsSubmitting(true)
    try {
      await axios.delete(`/api/v1/channels/${channelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success(t('toast.channelRemoved'))
      dispatch(closeModal())
    }
    catch (err) {
      toast.error(t('toast.networkError'))
      console.error('Remove channel error:', err)
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.confirm')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={() => dispatch(closeModal())} disabled={isSubmitting}>{t('modals.cancel')}</Button>
          <Button variant="danger" onClick={handleRemove} disabled={isSubmitting}>{t('modals.removeBtn')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Remove
