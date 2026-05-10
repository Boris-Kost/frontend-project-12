import * as yup from 'yup';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { logIn } from '../slices/authSlice';

const SignupPage = () => {
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const inputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .required('Обязательное поле')
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов'),
      password: yup
        .string()
        .required('Обязательное поле')
        .min(6, 'Не менее 6 символов'),
      confirmPassword: yup
        .string()
        .required('Обязательное поле')
        .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
    }),
    onSubmit: async (values) => {
      setRegistrationFailed(false);
      try {
        const response = await axios.post('/api/v1/signup', {
          username: values.username,
          password: values.password,
        });
        dispatch(logIn(response.data));
        navigate('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setRegistrationFailed(true);
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
                <h1 className="text-center mb-4">Регистрация</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    placeholder="Имя пользователя"
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={
                      registrationFailed || (formik.touched.username && formik.errors.username)
                    }
                    required
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">Имя пользователя</Form.Label>
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
                    placeholder="Пароль"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    isInvalid={
                      registrationFailed || (formik.touched.password && formik.errors.password)
                    }
                    required
                  />
                  <Form.Label htmlFor="password">Пароль</Form.Label>
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
                    placeholder="Подтвердите пароль"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    isInvalid={
                      registrationFailed ||
                      (formik.touched.confirmPassword && formik.errors.confirmPassword)
                    }
                    required
                  />
                  <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {registrationFailed
                      ? 'Такой пользователь уже существует'
                      : formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                  Зарегистрироваться
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
