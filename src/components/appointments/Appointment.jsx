/**
 * @typedef {Object} Patient
 * @property {number} id - Id patient
 * @property {string} firstName
 * @property {string} firstSurname
 * @property {string} documentType - Document type (CC, PAS, CI)
 * @property {string} idDocument
 */
/**
 * @typedef {Object} MyResultState
 * @property {Patient[]} patients - Patients lists results
 */
/**
 * @typedef {String} MySearchState - State string query
 */
/**
 * @typedef {Boolean} MySearchLoadingState
 */
/**
 * @typedef {Object} MyIdPatientState
 * @property {number} idPatient - Id patient
 */
/**
 * @typedef {Object} MyAppointmentState
 * @property {Appointment} appointment
 */
/**
 * @typedef {Object} Appointment
 * @param {number} id
 * @param {string} reason
 * @param {string} description
 * @param {string} startTime - Date and time
 * @param {string} endTime - Date and time
 * @param {DoctorObject} doctor - Doctor object
 * @param {PatientObject} doctor - Doctor object
 */
/**
 * @typedef {Object} ResponseData
 * @property {Appointment} appointment - Appointment
 */
/**
 * Doctor Object
 * @typedef {Object} DoctorObject
 * @param {number} id
 * @param {string} idDocument
 * @param {string} documentType
 * @param {string} firstName
 * @param {string} firstSurname
 */
/**
 * Patient Object
 * @typedef {Object} PatientObject
 * @param {number} id
 * @param {string} firstName
 * @param {string} firstSurname
 */
/**
 * @typedef {Object} useParams
 * @property {number} id - id appointment
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Col, Row, Button, Container, Dropdown } from "react-bootstrap";
import { Plus, MinusCircle } from 'react-feather';

import axiosClient from "../../axios-client.js";
import SearchBar from "../SearchBar.jsx";
import SearchResultsList from "../SearchResultsList.jsx";
import FormAppointment from "./FormAppointment.jsx";
import ErrorAlert from "../alerts/ErrorAlert.jsx";


export default function Appointment() {
  const navigate = useNavigate();
  const [results, setResults] = useState(/**@type {MyResultState}**/[]);
  const [search, setSearch] = useState(/**@type MySearchState**/'');
  const [isSearchLoading, setIsSearchLoading] = useState(/** @type MySearchLoadingState **/false);
  const [idPatient, setIdPatient] = useState(/**@type MyIdPatientState**/);
  const [patient, setPatient] = useState();
  const [appointment, setAppointment] = useState(/**@type MyAppointmentState**/);
  const [modalDelete, setModalDelete] = useState(false);
  const [error, setError] = useState(false);
  const {id} = useParams( /**@type useParams**/);

  useEffect(() => {
    if (id) {
      getAppointment(id);
    }
  }, []);

  useEffect(() => {
    if (idPatient) {
      getBriefPatientById()
    }
  }, [idPatient]);

  /**
   * Get short info about patient
   */
  const getBriefPatientById = () => {
    axiosClient.get('/patient/brief', {
      params: {
        id: idPatient
      }
    })
      .then(({data}) => {
        setPatient(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   *
   * @param {number} id - Id appointment
   */
  const getAppointment = (id) => {
    axiosClient.get('/appointment', {
      params: {
        id: id
      }
    })
      .then(({data}) => {
        setAppointment(data.appointment)
      })
      .catch((err) => {
        setError(err)
      })
  }


  return (
    <>
      <section>
        <Card>
          <Card.Body>
            <Row>
              {id ?
                <>
                  <Col xs={7} md={9} lg={10}>
                    <h1>Editar cita</h1>
                  </Col>
                  <Col xs={5} md={3} lg={2} className='text-end'>
                    <Dropdown>
                      <Dropdown.Toggle variant='tertiary'>
                        Opciones
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item className='dropdown-item-delete' onClick={() => setModalDelete(true)}>
                          <MinusCircle height='20' width='20' className='me-2'/>Eliminar cita
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </>
                : <Col xs={12}><h1>Añadir nueva cita</h1></Col>
              }
            </Row>
            {/* Search Bar and button*/}
            {!id &&
              <section className='mt-5'>
                <Container>
                  <Row>
                    <Col xs={12} md={2} lg={2} xl={2} className='align-self-center'>
                      <Form.Label>Buscar paciente</Form.Label>
                    </Col>
                    <Col xs={12} md={5} lg={5} xl={4} className='align-self-center'>
                      <SearchBar setResults={setResults} setIsSearchLoading={setIsSearchLoading} search={search}
                                 setSearch={setSearch}/>
                      <SearchResultsList results={results} isSearchLoading={isSearchLoading} setIdPatient={setIdPatient}
                                         setSearch={setSearch}/>
                    </Col>
                    <Col xs={12} md={5} lg={4} xl={5} className='align-self-center text-end offset-lg-1 '>
                      <Button variant='tertiary'>
                        <Plus height='20' width='20' className='me-2'/>
                        Añadir un paciente
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </section>
            }
            {/* End Search Bar and button*/}

            {/*Form new appointment*/}
            <section className='mt-5'>
              <FormAppointment patient={patient} appointment={appointment} setError={setError}
                               modalDelete={modalDelete} setModalDelete={setModalDelete}/>
            </section>
            {/* End Form new appointment*/}
          </Card.Body>
        </Card>
      </section>

      {/*Card buttons */}
      <section className='mt-4'>
        <Card>
          <Card.Body>
            <Container>
              <Row>
                <Col xs={12} className='text-center'>
                  <Button variant='secondary' onClick={() => navigate(-1)}> Cancelar</Button>
                  {appointment ?
                    <Button variant='primary' form='form-appointment' type='submit' className='ms-5'>Actualizar</Button>
                    : <Button variant='primary' form='form-appointment' type='submit' className='ms-5'>Guardar</Button>
                  }
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        {error ?
          <ErrorAlert err={error.response}/> : ''
        }
      </section>
      {/* End Card buttons */}
    </>
  );
}



