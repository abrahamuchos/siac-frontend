import React from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();
  return (
    <>
      <Container className='vh-100 d-flex align-items-center'>
        <Row>
          <Col xs={12}>
            <h1>403 Forbidden</h1>
            <h5 className='mt-5'>No posee los permisos para visualizar esta pagina</h5>
            <Button variant='primary' onClick={() => navigate('/')}>Ir a home</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}