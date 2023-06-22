import React from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Container className='vh-100 d-flex align-items-center'>
        <Row>
          <Col xs={12}>
            <h1>404 Not found</h1>
            <h5 className='mt-5'>La pagina solicitada no fue encontrada o no existe</h5>
            <Button variant='primary' onClick={() => navigate('/')}>Ir a home</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

