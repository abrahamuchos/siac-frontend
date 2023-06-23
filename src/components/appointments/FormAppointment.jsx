/**
 * Specialists object (doctors)
 * @typedef {Object} Specialists
 * @property {number} id - Doctor id
 * @property {string} firstName
 * @property {string} firstSurname
 * @property {string} idDocument
 * @property {string} gradeType
 */
/**
 * @typedef {Object} ResponseData
 * @property {Array.<Specialists>} specialists - Lists of doctors
 */
/**
 * Appointment Object
 * @typedef {object} Appointment
 * @property {number} id
 * @property {string} reason
 * @property {string} description
 * @property {string} startTime - Date and time
 * @property {string} endTime - Date and time
 * @property {Doctor} doctor - Doctor object
 * @property {Patient} patient - Patient object
 */
/**
 * Doctor Object
 * @typedef {Object} Doctor
 * @property {number} id
 * @property {string} idDocument
 * @property {string} documentType
 * @property {string} firstName
 * @property {string} firstSurname
 */
/**
 * Patient Object
 * @typedef {Object} Patient
 * @property {number} id
 * @property {string} firstName
 * @property {string} firstSurname
 * @property {string} document
 */
/**
 * @typedef {Object} MySuccessModalState
 * @property {string} title
 * @property {boolean} show
 * @property {string} message
 */
/**
 * @typedef {Object} ResponseData
 * @property {Array.<ReasonsDelete>} reasonsDelete - Appointments lists
 */
/**
 * @typedef {Object} ReasonsDelete
 * @property {number} id
 * @property {string} name
 */
/**
 * @typedef {Object} MyReasonsDeleteState
 * @property {Array.<ReasonsDelete>} reasonDelete
 */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal } from "react-bootstrap";
import { Formik, useFormik } from "formik";
import { object, string, date } from 'yup';
import Moment from 'moment';
import DatePicker, { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import { getDay } from "date-fns";

import axiosClient from "../../axios-client.js";
import { useUserContext } from "../../contexts/UserProvider.jsx";
import ModalLoader from "../modals/ModalLoader.jsx";
import ModalSuccess from "../modals/ModalSuccess.jsx";


import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";




//Load an imported locale object
registerLocale('es', es)

/**
 *
 * @param {Object} patient
 * @param {Appointment} appointment - appointment
 * @param setError
 * @param {boolean} modalDelete
 * @param setModalDelete
 * @return {JSX.Element}
 * @constructor
 */
export default function FormAppointment({patient, appointment, setError, modalDelete, setModalDelete}) {
  const {user} = useUserContext();
  const location = useLocation();
  const pathname = location.pathname.split('/');
  const [specialists, setSpecialists] = useState([]);
  const [consultationHours, setConsultationHours] = useState([]);
  const [reasonsDelete, setReasonsDelete] = useState(/**@type MyReasonsDeleteState**/[]);
  const [successModal, setSuccessModal] = useState(/**@type MySuccessModalState**/ {show: false, message: ''});
  const [loaderModal, setLoaderModal] = useState(false);
  const [counter, setCounter] = useState();
  const appointmentSchema = object({
    name: string().required('El nombre y apellido del paciente es requerido'),
    document: string().required('Documento del paciente es requerido'),
    specialist: string().required('Un especialista es requerido'),
    reason: string()
      .min(3, 'Min. 3 caracteres')
      .max(100, 'Max. 100 caracteres')
      .required('El motivo es requerido'),
    description: string().min(3, 'Min. 3 caracteres')
      .max(100, 'Max. 100 caracteres')
      .required('La descripción es requerida'),
    date: date().required('Una fecha de consulta es requerida'),
    startTime: date().required().default(() => new Date()),
    endTime: date()
      .required('Hora fin es requerida')
      .when('startTime', (startTime, schema) =>
        startTime && schema.min(startTime, 'La hora final debe ser mayor a la hora de inicio')
      )
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      document: '',
      specialist: (user.role.id === 3 ? user.id : ''),
      reason: '',
      description: '',
      date: '',
      startTime: '',
      endTime: ''
    },
    validationSchema: appointmentSchema,
    onSubmit: (values, {setSubmitting}) => handleSubmit(values, setSubmitting)
  })
  const reasonDeleteSchema = object({
    reasonDelete: string().required('Debe seleccionar una razón')
  })

  /**
   * Get specialist if be UM or AS (Role)
   * Get consultation hours if be MD (Role)
   */
  useEffect(() => {
    if (user.role.id === 2 || user.role.id === 4) {
      getSpecialists();
    }else if(user.role.id === 3){
      getConsultationHours(user.id)
    }

  }, []);

  //Charge values to form (Update form)
  useEffect(() => {
    if (appointment) {
      formik.setValues({
        name: (appointment.patient.firstName + ' ' + appointment.patient.firstSurname),
        document: appointment.patient.document,
        reason: appointment.reason,
        description: appointment.description,
        specialist: appointment.doctor.id,
        date: new Date(appointment.startTime),
        startTime: new Date(appointment.startTime),
        endTime: new Date(appointment.endTime)
      });
      getConsultationHours(appointment.doctor.id)
    }
  }, [appointment]);

  useEffect(() => {
    if (patient) {
      formik.setFieldValue('name', patient.firstName + ' ' + patient.firstSurname);
      formik.setFieldValue('document', patient.idDocument);
    }
  }, [patient]);

  useEffect(() => {
    let interval = null;
    if (counter > 0 && modalDelete) {
      interval = setInterval(() => {
        setCounter(counter - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [counter]);

  useEffect(() => {
    if (modalDelete) {
      setCounter(5);
      getReasonsDelete();
    }
  }, [modalDelete]);

  useEffect(() => {
    if (formik.values.specialist.length > 0) {
      formik.values.date = '';
      formik.values.startTime = '';
      formik.values.endTime = '';
      getConsultationHours(formik.values.specialist)
    }
  }, [formik.values.specialist]);

  /**
   *
   * @param {number|string} doctorId
   */
  const getConsultationHours = (doctorId) => {
    if(isNaN(parseInt(doctorId))){
      setConsultationHours([]);
      return;
    }

    axiosClient.get('/appointments/all-consultation-hours', {
      params: {
        doctorId: doctorId
      }
    })
      .then(({data}) => {
        data.consultationHours.map(function(item){
           item.startTime = new Date('1996-11-29T'+ item.startTime)
           item.endTime = new Date('1996-11-29T'+ item.endTime)
        })
        setConsultationHours(data.consultationHours)
      })
      .catch((err) => {
        setError(err)
      });
  }

  /**
   * Get all associated doctors (specialists)
   */
  const getSpecialists = () => {
    axiosClient.get('/appointment/specialists')
      .then(({data}) => {
        data.specialists.sort((a, b) => a.firstSurname.localeCompare(b.firstSurname));
        setSpecialists(data.specialists)
      })
      .catch((err) => {
        console.error(err);
      })
  }

  /**
   * Get all reasons delete options
   */
  const getReasonsDelete = () => {
    axiosClient.get('/appointment/reason-delete')
      .then(({data}) => {
        setReasonsDelete(data)
      })
      .catch((err) => {
        setError(err)
      })
  }

  const handleSubmit = (values, setSubmitting) => {
    setError(false);
    setLoaderModal(true);
    if (appointment) {
      updateAppointment(values)
    } else {
      postAppointment(values)
    }
  }

  /**
   *
   * @param {Object} values
   */
  const handleDelete = (values) => {
    setModalDelete(false);
    setLoaderModal(true);
    deleteAppointment(values.reasonDelete);
  }

  /**
   * Validate if day work
   * @param {Date} date
   * @return {boolean}
   */
  const handleFilterDate = (date) => {
    if(consultationHours.length === 0){
      return false;
    }

    let day = getDay(date);
    // Convert day 0 to 7 (Sunday)
    day = day === 0 ? 7 : day;

    return consultationHours.find(el => parseInt(el.dayOfWeek) === day)
  }

  /**
   * Validate if time work
   * @param {Date} date
   * @return {boolean}
   */
  const handleFilterTime = (date) => {
    if(consultationHours.length === 0){
      return false;
    }

    const selectedDate = formik.values.date;
    let day = getDay(selectedDate);
    // Convert day 0 to 7 (Sunday)
    day = day === 0 ? 7 : day;
    date.setDate(29);
    date.setMonth(10);
    date.setYear(1996);

    return consultationHours.find( el => parseInt(el.dayOfWeek) === day && el.startTime <= date && el.endTime >= date);
  }

  /**
   * Create new appointment
   * @param {Object} values
   */
  const postAppointment = (values) => {
    let payload = {
      idPatient: patient.id,
      idDoctor: values.specialist,
      idMedicalUnit: (user.medicalUnit?.id ?? user.id),
      reason: values.reason,
      description: values.description,
      date: Moment(values.date).format('YYYY-MM-DD'),
      startTime: Moment(values.startTime).format('HH:mm:ss'),
      endTime: Moment(values.endTime).format('HH:mm:ss')
    }
    axiosClient.post('/appointment', payload)
      .then(() => {
        setLoaderModal(false);
        setSuccessModal({
          show: true,
          title: 'Guardado con éxito',
          message: 'La cita para el paciente fue creada exitosamente.',
          url: `/${pathname[1]}/appointments`
        })
      })
      .catch((err) => {
        setLoaderModal(false);
        setError(err);
      })
  }

  /**
   * Update Appoinment
   * @param {Object} values
   */
  const updateAppointment = (values) => {
    let payload = {
      idDoctor: values.specialist,
      idMedicalUnit: (user.medicalUnit?.id ?? user.id),
      reason: values.reason,
      description: values.description,
      date: Moment(values.date).format('YYYY-MM-DD'),
      startTime: Moment(values.startTime).format('HH:mm:ss'),
      endTime: Moment(values.endTime).format('HH:mm:ss')
    }
    axiosClient.put(`/appointment/${appointment.id}`, payload)
      .then(() => {
        setLoaderModal(false);
        setSuccessModal({
          show: true,
          title: 'Actualizado con éxito',
          message: 'La cita para el paciente fue actualizada exitosamente.',
          url: `/${pathname[1]}/appointments`
        })
      })
      .catch((err) => {
        setLoaderModal(false);
        setError(err);
      })
  }

  /**
   *
   * @param {number} reasonId
   */
  const deleteAppointment = (reasonId) => {
    let payload = {
      reasonId: reasonId
    }
    axiosClient.delete(`/appointment/${appointment.id}`, {data: payload})
      .then(() => {
        setLoaderModal(false);
        setSuccessModal({
          show: true,
          title: 'Eliminado con éxito',
          message: 'La cita para el paciente fue eliminada exitosamente.',
          url: `/${pathname[1]}/appointments`
        })
      })
      .catch((err) => {
        setError(err);
      });
  }


  return (<>

    <Form id='form-appointment' className='container' onSubmit={formik.handleSubmit} autoComplete="off" noValidate>

      <Form.Group className='row'>
        <Col xs={6} lg={2} className='align-self-center mt-3 mt-lg-0'>
          <Form.Label>Nombre y apellido</Form.Label>
        </Col>
        <Col xs={6} lg={4} className='mt-3 mt-lg-0'>
          <Form.Control type='text' name='name' value={formik.values.name} onChange={formik.handleChange}
                        disabled={true}
                        className={formik.touched.name && formik.errors.name ? "error-input" : null}/>
          {formik.touched.name && formik.errors.name ? (
            <div className="error-input-message">{formik.errors.name}</div>) : null}
        </Col>
        <Col xs={6} lg={2} className='align-self-center text-start text-lg-end mt-3 mt-lg-0'>
          <Form.Label>Documento</Form.Label>
        </Col>
        <Col xs={6} lg={4} className='mt-3 mt-lg-0'>
          <Form.Control type='text' name='document' value={formik.values.document} onChange={formik.handleChange}
                        disabled={true}
                        className={formik.touched.document && formik.errors.document ? "error-input" : null}/>
          {formik.touched.document && formik.errors.document ? (
            <div className="error-input-message">{formik.errors.document}</div>) : null}
        </Col>
      </Form.Group>

      <Form.Group className='row mt-4' controlId='specialist'>
        <Col xs={6} lg={2} className='align-self-center'>
          <Form.Label>Especialista</Form.Label>
        </Col>
        <Col xs={6} lg={4}>
          <Form.Control as='select' name='specialist' value={formik.values.specialist} onChange={formik.handleChange}
                        className='form-select'
                        isInvalid={formik.touched.specialist && formik.errors.specialist}>
            {user.role.id === 3 ? (
              <>
                <option>Seleccione un especialista</option>
                <option value={user.id}>
                  {user.gradeType + ' ' + user.firstSurname + ' ' + user.firstName}
                </option>
              </>
            ) : (<>
                <option>Seleccione un especialista</option>
                {specialists.map((specialist) =>
                  <option key={specialist.id} value={specialist.id}>
                    {specialist.gradeType + ' ' + specialist.firstSurname + ', ' + specialist.firstName + ' (' + specialist.idDocument + ')'}
                  </option>
                )}
              </>
            )
            }
          </Form.Control>
          {formik.touched.specialist && formik.errors.specialist ? (
            <div className="error-input-message">{formik.errors.specialist}</div>) : null}
        </Col>

        <Col xs={6} lg={2} className='align-self-center text-start text-lg-end mt-3 mt-lg-0'>
          <Form.Label>Motivo de consulta</Form.Label>
        </Col>
        <Col xs={6} lg={4} className='mt-3 mt-lg-0'>
          <Form.Control type='text' name='reason' value={formik.values.reason} onChange={formik.handleChange}
                        className={formik.touched.reason && formik.errors.reason ? "error-input" : null}/>
          {formik.touched.reason && formik.errors.reason ? (
            <div className="error-input-message">{formik.errors.reason}</div>) : null}
        </Col>
      </Form.Group>

      <Form.Group className='row mt-4'>
        <Col xs={12} className='align-self-center'>
          <Form.Label>Descripción</Form.Label>
        </Col>
        <Col xs={12}>
          <Form.Control as="textarea" name='description' style={{height: '100px'}} value={formik.values.description}
                        onChange={formik.handleChange}
                        className={formik.touched.description && formik.errors.description ? "error-input" : null}/>
          {formik.touched.description && formik.errors.description ? (
            <div className="error-input-message">{formik.errors.description}</div>) : null}
        </Col>
      </Form.Group>

      <Form.Group className='row mt-4'>
        <Col xs={6} lg={2} className='align-self-center'>
          <Form.Label>Fecha</Form.Label>
        </Col>
        <Col xs={6} lg={3}>
          <DatePicker showIcon name='date' selected={formik.values.date} minDate={new Date()} format='dd/MM/yyyy'
                      value={formik.values.date} onChange={date => formik.setFieldValue('date', date)}
                      className={'form-control ' + (formik.touched.date && formik.errors.date ? "error-input" : null)}
                      dateFormat='dd/MM/yyyy' locale="es" filterDate={handleFilterDate}/>
          {formik.touched.date && formik.errors.date ? (
            <div className="error-input-message">{formik.errors.date}</div>) : null}
        </Col>
      </Form.Group>

      <Form.Group className='row mt-4'>
        <Col xs={6} lg={2} className='align-self-center'>
          <Form.Label>Hora inicio</Form.Label>
        </Col>
        <Col xs={6} lg={3}>
          <DatePicker showTimeSelect showTimeSelectOnly name='startTime' selected={formik.values.startTime}
                      onChange={time => formik.setFieldValue('startTime', time)} filterTime={handleFilterTime}
                      className={'form-control ' + (formik.touched.startTime && formik.errors.startTime ? "error-input" : null)}
                      timeIntervals={15} timeCaption="Hora Inicio" dateFormat='h:mm aa' locale="es"/>
          {formik.touched.startTime && formik.errors.startTime ? (
            <div className="error-input-message">{formik.errors.startTime}</div>) : null}
        </Col>
        <Col xs={6} lg={2} className='align-self-center text-start text-lg-end offset-lg-1 mt-3 mt-lg-0'>
          <Form.Label>Hora Fin</Form.Label>
        </Col>
        <Col xs={6} lg={3} className='mt-3 mt-lg-0'>
          <DatePicker showTimeSelect showTimeSelectOnly name='endTime' selected={formik.values.endTime}
                      onChange={time => formik.setFieldValue('endTime', time)} filterTime={handleFilterTime}
                      className={'form-control ' + (formik.touched.endTime && formik.errors.endTime ? "error-input" : null)}
                      timeIntervals={15} timeCaption="Hora Fin" dateFormat='h:mm aa' locale="es"/>
          {formik.touched.endTime && formik.errors.endTime ? (
            <div className="error-input-message">{formik.errors.endTime}</div>) : null}
        </Col>
      </Form.Group>
    </Form>

    {/*Modals (Success, Loader and Delete)*/}
    <ModalLoader show={loaderModal}/>

    <ModalSuccess show={successModal.show} title={successModal.title} message={successModal.message} url={successModal.url}/>

    <Modal show={modalDelete} onHide={() => setModalDelete(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Eliminar cita médica
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Está seguro que desea eliminar la cita médica?
        <Formik initialValues={{reasonDelete: ''}} onSubmit={handleDelete} validationSchema={reasonDeleteSchema}>
          {({values, errors, touched, handleChange, handleSubmit, isSubmitting}) => (
            <form id='form-reason-delete' onSubmit={handleSubmit}>
              <Form.Group className='px-3 mt-3'>
                <Form.Control as='select' name='reasonDelete' value={values.id} onChange={handleChange}
                              className='form-select' isInvalid={touched.reasonDelete && errors.reasonDelete}>
                  <option>Razones para eliminar una cita</option>
                  {reasonsDelete.map((reason) => <option key={reason.id} value={reason.id}>{reason.name}</option>)}
                </Form.Control>
                {touched.reasonDelete && errors.reasonDelete ? (
                  <div className="error-input-message">{errors.reasonDelete}</div>) : null}
              </Form.Group>
            </form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='me-3' onClick={() => setModalDelete(false)}>Cancelar</Button>
        <Button variant='danger' disabled={counter > 0} form='form-reason-delete' type='submit'>
          {'(' + counter + ') '}Sí, eliminar
        </Button>
      </Modal.Footer>
    </Modal>

    {/*End Modals (Success, Loader and Delete)*/}
  </>);
}
