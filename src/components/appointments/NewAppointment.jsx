import React from 'react';
import { Card, Form, Col, Row, Button } from "react-bootstrap";
import { Formik } from "formik";
import { object, string } from 'yup';
import { Plus } from 'react-feather';
export default function NewAppointment() {
  let searchSchema = object({
    patient: string()
  });

  const handleSearch = (values, setSubmitting) => {

  }

  return (
    <>
      <section>
        <Card>
          <Card.Body>
            <h1>Añadir nueva cita</h1>
            <section className='mt-4'>
              <Formik initialValues={{patient: ''}} validationSchema={searchSchema}
                      onSubmit={(values, {setSubmitting}) => handleSearch(values, setSubmitting)}>
                {({handleSubmit, values, handleChange, touched, errors, isSubmitting}) => (
                  <Form className='container' noValidate>
                    <Form.Group className='row'>
                      <Col xs={12} md={2} lg={2} xl={2} className='align-self-center'>
                        <Form.Label>Buscar paciente</Form.Label>
                      </Col>
                      <Col xs={12} md={5} lg={5} xl={4} className='align-self-center'>
                        <Form.Control type='text' />
                      </Col>
                      <Col xs={12} md={5} lg={4} xl={5} className='align-self-center text-end offset-lg-1 '>
                        <Button variant='tertiary'>
                          <Plus height='20' width='20' className='me-2  '/>
                          Añadir un paciente
                        </Button>
                      </Col>
                    </Form.Group>
                  </Form>
                )}
              </Formik>
            </section>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}