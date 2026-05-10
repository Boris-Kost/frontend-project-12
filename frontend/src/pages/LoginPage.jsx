import * as yup from 'yup';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { logIn } from '../slices/authSlice';

const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object({
      username: yup.string().required(t('errors.required')),
      password: yup.string().required(t('errors.required')),
    }),
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const response = await axios.post('/api/v1/login', values);
        dispatch(logIn(response.data));
        navigate('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        console.error(err);
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('login.title')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    placeholder={t('login.username')}
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={authFailed || (formik.touched.username && formik.errors.username)}
                    required
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">{t('login.username')}</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder={t('login.password')}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    isInvalid={authFailed || (formik.touched.password && formik.errors.password)}
                    required
                  />
                  <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {authFailed ? t('errors.authFailed') : formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="outline-primary" className="w-100 mb-3">{t('login.submit')}</Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.noAccount')}</span>
                <Link to="/signup">{t('login.signup')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
