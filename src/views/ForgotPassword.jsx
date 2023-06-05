import React, { useState } from 'react';
import axiosClient from "../axios-client.js";
import { Alert, Button, Card, FloatingLabel, Form } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from "yup";
import Footer from "../components/Footer.jsx";

import '../scss/pages/forgotPassword.scss';
import EkgLoader from "../components/EkgLoader.jsx";

export default function ForgotPassword() {
  const [notification, setNotification] = useState();
  const [errors, setErrors] = useState(false);

  const forgotSchema = object({
    email: string().email('Email invalido, ej. hello@correo.com')
      .required('Correo electrónico es un campo requerido'),
  })

  const handleForgot = (values, setSubmitting) => {
    setSubmitting(true)
    let payload = {
      email: values.email
    }

    axiosClient.post('/forgot-password', payload)
      .then(() => {
        setSubmitting(false);
        setNotification(`Fue enviado un correo a ${payload.email}, por favor siga sus instruciones para cambiar su contraseña`)
      })
      .catch((err) => {
        setSubmitting(false);
        console.error(err);
        setErrors('Upss algo ha sucedido intente nuevamente');
      })
  }

  return (
    <>
      <div className='text-center mt-5'>
        <h1>Logo</h1>
      </div>

      <Card id="forgot">
        <Card.Body>
          <div className='text-center'>
            <p>
              Ingrese el correo electrónico asociado con su cuenta y enviaremos un correo para restablecer su contraseña
            </p>
          </div>

          <Formik initialValues={{email: ''}} validationSchema={forgotSchema}
                  onSubmit={(values, {setSubmitting}) => handleForgot(values, setSubmitting)}>
            {({handleSubmit, values, handleChange, touched, errors, isSubmitting}) => (
              <Form className='d-flex flex-column justify-content-center align-items-center' noValidate
                    onSubmit={handleSubmit}>
                <FloatingLabel label='Correo electrónico' controlId='email'>
                  <Form.Control type='email' placeholder='nombre@correo.com' name='email' value={values.email}
                                onChange={handleChange}
                                className={touched.email && errors.email ? "error-input" : null}/>
                  {touched.email && errors.email ? (
                    <div className="error-input-message">{errors.email}</div>
                  ) : null}
                </FloatingLabel>
                <div className='d-grid gap-2 d-md-block text-center mt-3'>
                  {isSubmitting ? <EkgLoader className='mt-4'/>
                    : <Button variant='primary' type='submit' disabled={isSubmitting}>Recuperar contraseña</Button>
                  }
                </div>
              </Form>
            )}
          </Formik>

        </Card.Body>
      </Card>
      {errors ?
        <Alert variant='danger' dismissible>
          <div>{errors}</div>
        </Alert> : ''
      }
      {notification ?
        <Alert variant='success'>
          <p className='m-0'>{notification}</p>
        </Alert> : ''
      }

      <Footer/>
    </>
  );
}