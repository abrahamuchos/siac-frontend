import React, { useRef, useState } from 'react';
import { useUserContext } from "../contexts/UserProvider.jsx";
import axiosClient from "../axios-client.js";
import { Navigate } from "react-router-dom";
import { Alert, Button, Card, FloatingLabel, Form } from "react-bootstrap";
import { Formik, useFormik } from "formik";
import { object, string } from "yup";
import Footer from "../components/Footer.jsx";

import '../scss/pages/login.scss';

export default function Login() {
  const {token, setToken, setUser, user} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(false);

  let loginSchema = object({
    email: string().email('Email invalido, ej. hello@correo.com').required('Correo electrónico es un campo requerido'),
    password: string().min(3).required('Contraseña es un campo requerido')
  });

  const handleLogin = (values, setSubmitting) => {
    setErrors(false)
    setIsLoading(true)
    setSubmitting(true);
    const payload = {
      email: values.email,
      password: values.password
    }

    axiosClient.post('/login', payload)
      .then(({data}) => {
        setToken(data.token);
        setUser(data.user);
        setIsLoading(false)
      })
      .catch((err) => {
        let response = err.response;
        console.error(err)
        setIsLoading(false)
        setSubmitting(false);
        if(response && response.status === 422){
          setErrors('Correo electrónico o contraseña incorrecta, intente nuevamente');
        }
      });
  }


  return (<>
    <Card id='login'>
      <Card.Body>
        <div className='card-img text-center'>
          <img src="https://placehold.co/800x400?text=Logo" alt="UPCM Logo"/>
        </div>

        <Formik initialValues={{email: '', password: ''}} validationSchema={loginSchema}
                onSubmit={(values, {setSubmitting}) => handleLogin(values, setSubmitting)}>
          {({handleSubmit, values, handleChange, touched, errors, isSubmitting}) => (
            <Form className='d-flex flex-column justify-content-center m-auto' noValidate onSubmit={handleSubmit}>
              <FloatingLabel label='Correo electrónico' controlId='email'>
                <Form.Control type='email' placeholder='nombre@correo.com' name='email' value={values.email}
                              onChange={handleChange} className={touched.email && errors.email ? "error-input" : null}/>
                {touched.email && errors.email ? (
                  <div className="error-input-message">{errors.email}</div>
                ) : null}
              </FloatingLabel>
              <FloatingLabel label='Contraseña' controlId='password'>
                <Form.Control type='password' placeholder='contraseña' name='password' value={values.password}
                              onChange={handleChange}
                              className={touched.password && errors.password ? "error-input" : null}/>
                {touched.password && errors.password ? (
                  <div className="error-input-message">{errors.password}</div>
                ) : null}
                <small className='float-end mt-2'>
                  <a href="/#" className='text-decoration-none'>Olvide la contraseña</a>
                </small>
              </FloatingLabel>

              <div className='d-grid gap-2 d-md-block text-center mt-3'>
                <Button variant='primary' type='submit' disabled={isSubmitting}>Iniciar sesión</Button>
              </div>
            </Form>
          )}

        </Formik>

      </Card.Body>
    </Card>
    <Footer/>

    { errors ?
      <Alert variant='danger' dismissible>
        <div>{errors}</div>
      </Alert> : ''
    }

    {isLoading ? null : (user.role?.id === 1 && token ?
      <Navigate to='/admin' replace/> : user.role?.id === 2 && token ?
        <Navigate to='/um' replace/> : user.role?.id === 3 && token ?
          <Navigate to='/doctor' replace/> : user.role?.id === 4 && token ? <Navigate to='/assistant' replace/> :
            '')}
  </>);
}