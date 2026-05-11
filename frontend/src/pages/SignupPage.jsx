import * as yup from 'yup'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { Button, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { logIn } from '../slices/authSlice'

const SignupPage = () => {
  const [registrationFailed, setRegistrationFailed] = useState(false)
  const inputRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .required(t('errors.required'))
        .min(3, t('errors.usernameLength'))
        .max(20, t('errors.usernameLength')),
      password: yup
        .string()
        .required(t('errors.required'))
        .min(6, t('errors.passwordLength')),
      confirmPassword: yup
        .string()
        .required(t('errors.required'))
        .oneOf([yup.ref('password'), null], t('errors.passwordMatch')),
    }),
    onSubmit: async (values) => {
      setRegistrationFailed(false)
      try {
        const response = await axios.post('/api/v1/signup', {
          username: values.username,
          password: values.password,
        })
        dispatch(logIn(response.data))
        navigate('/')
      } catch (err) {
        if (err.isAxiosError && err.response?.status === 409) {
          setRegistrationFailed(true)
          inputRef.current.select()
          return
        }
        toast.error(t('toast.networkError'))
        console.error(err)
      }
    },
  })

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('signup.title')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    placeholder={t('signup.username')}
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={
                      registrationFailed || (formik.touched.username && formik.errors.username)
                    }
                    required
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">{t('signup.username')}</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t('signup.password')}
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    isInvalid={
                      registrationFailed || (formik.touched.password && formik.errors.password)
                    }
                    required
                  />
                  <Form.Label htmlFor="password">{t('signup.password')}</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    placeholder={t('signup.confirmPassword')}
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    isInvalid={
                      registrationFailed ||
                      (formik.touched.confirmPassword && formik.errors.confirmPassword)
                    }
                    required
                  />
                  <Form.Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {registrationFailed
                      ? t('errors.userExists')
                      : formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                  {t('signup.submit')}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
