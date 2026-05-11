import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'
import axios from 'axios'
import { closeModal } from '../../slices/modalSlice'
import { selectors as channelsSelectors } from '../../slices/channelsSlice'

const Rename = () => {
  const dispatch = useDispatch()
  const inputRef = useRef()
  const { token } = useSelector(state => state.auth)
  const { item: channelId } = useSelector(state => state.modal)
  const { t } = useTranslation()
  
  const channel = useSelector(state => channelsSelectors.selectById(state, channelId))
  const channels = useSelector(channelsSelectors.selectAll)
  const channelNames = channels.map(c => c.name)

  useEffect(() => {
    setTimeout(() => inputRef.current?.select(), 0)
  }, [])

  const formik = useFormik({
    initialValues: { name: channel.name },
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
        const filteredName = filter.clean(values.name)
        await axios.patch(`/api/v1/channels/${channelId}`, { name: filteredName }, {
          headers: { Authorization: `Bearer ${token}` },
        })
        toast.success(t('toast.channelRenamed'))
        dispatch(closeModal())
      }
      catch (err) {
        toast.error(t('toast.networkError'))
        console.error('Rename channel error:', err)
      }
    },
  })

  return (
    <Modal show onHide={() => dispatch(closeModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.rename')}</Modal.Title>
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
  )
}

export default Rename
