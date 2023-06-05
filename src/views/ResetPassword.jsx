import React, {  useState } from 'react';
import axiosClient from "../axios-client.js";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, Card, FloatingLabel, Form } from "react-bootstrap";
import { object, ref, string } from "yup";
import { Formik } from "formik";

import Footer from "../components/Footer.jsx";
import EkgLoader from "../components/EkgLoader.jsx";


import '../scss/pages/forgotPassword.scss';

export default function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notification, setNotification] = useState();
  const [errors, setErrors] = useState(false);

  const resetSchema = object({
    password: string().required('Campo requerido')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(50, 'La contraseña debe tener máximo 50 caracteres'),
    passwordConfirmation: string().oneOf(
      [ref('password'), null], 'Las contraseñas deben coincidir'
    ).required('Campo es requerido')
  });


  const handleReset = (values, setSubmitting) => {
    setErrors(false)
    setSubmitting(true);

    let payload = {
      email: searchParams.get('email'),
      token: searchParams.get('token'),
      password: values.password,
      password_confirmation: values.passwordConfirmation,
    }

    axiosClient.post('/reset-password', payload)
      .then(({data}) => {
        setSubmitting(false);
        setNotification('Su contraseña fue cambida exitosamente, puede iniciar sesion.')

      }).catch((err) => {
      console.error(err)
      setSubmitting(false);
      setErrors('Upss algo ha sucedido intente nuevamente');
    });

  }

  return (<>
      <div className='text-center mt-5'>
        <h1>Logo</h1>
      </div>

      <Card id="forgot">
        <Card.Body>
          <div className='text-center'>
            <h3>Cambiar contraseña</h3>
            <p>
              Por favor ingrese su nueva contraseña
            </p>
          </div>

          <Formik initialValues={{password: '', passwordConfirmation: ''}} validationSchema={resetSchema}
                  onSubmit={(values, {setSubmitting}) => handleReset(values, setSubmitting)}>
            {({handleSubmit, values, handleChange, touched, errors, isSubmitting}) => (
              <Form className='d-flex flex-column justify-content-center align-items-center' noValidate
                    onSubmit={handleSubmit}>
                <FloatingLabel label='Contraseña' controlId='password'>
                  <Form.Control type='password' placeholder='contraseña' name='password' value={values.password}
                                onChange={handleChange}
                                className={touched.password && errors.password ? "error-input" : null}/>
                  {touched.password && errors.password ? (
                    <div className="error-input-message">{errors.password}</div>
                  ) : null}
                </FloatingLabel>
                <FloatingLabel label='Confirmar contraseña' controlId='passwordConfirmation'>
                  <Form.Control type='password' placeholder='contraseña' name='passwordConfirmation'
                                value={values.passwordConfirmation}
                                onChange={handleChange}
                                className={touched.passwordConfirmation && errors.passwordConfirmation ? "error-input" : null}/>
                  {touched.passwordConfirmation && errors.passwordConfirmation ? (
                    <div className="error-input-message">{errors.passwordConfirmation}</div>
                  ) : null}
                </FloatingLabel>

                <div className='d-flex flex-column justify-content-center align-items-center'>
                  {isSubmitting ? <EkgLoader className='mt-4'/>
                    : <Button variant='primary' type='submit' disabled={isSubmitting}>Cambiar contraseña</Button>
                  }
                </div>
              </Form>
            )}
          < /Formik>

        </Card.Body>
      </Card>

      <Footer/>

      {errors ?
        <Alert variant='danger' dismissible>
          <div>{errors}</div>
        </Alert> : ''
      }
      {notification ?
        <Alert variant='success'>
          <p className='m-0'>{notification} <Link to='/login' replace={true}>Iniciar sesión</Link></p>
        </Alert> : ''
      }

    </>
  );
}