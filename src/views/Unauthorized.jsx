import React from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <>
      <Container className='vh-100 d-flex align-items-center'>
        <Row>
          <Col xs={12}>
            <h1>401 Unauthorized</h1>
            <h5 className='mt-5'>No esta autenticado, debe autenticarse</h5>
            <Button variant='primary' onClick={() => navigate('/')}>Iniciar Sesión</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

