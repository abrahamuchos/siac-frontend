import React, { useState } from 'react';
import { useUserContext } from "../contexts/UserProvider.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { Button, Card, FloatingLabel, Form } from "react-bootstrap";
import '../scss/pages/login.scss';
import Footer from "../components/Footer.jsx";

export default function Login() {
  const {token, setToken, setUser, user} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    const payload = {
      email: 'bridgette46@gmail.com',
      password: 'password'
    }

    axiosClient.post('/login', payload)
      .then(({data}) => {
        setToken(data.token);
        setUser(data.user);
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      });
  }

  return (
    <>
      <Card id='login'>
        <Card.Body>
          <div className='card-img text-center'>
            <img src="https://placehold.co/800x400?text=Logo" alt="UPCM Logo"/>
          </div>
          <Form className='d-flex flex-column justify-content-center m-auto'>
            <FloatingLabel label='Correo electrónico' controlId='email'>
              <Form.Control type='email' placeholder='nombre@correo.com'/>
            </FloatingLabel>
            <FloatingLabel label='Contraseña' controlId='password'>
              <Form.Control type='password' placeholder='contraseña'/>
              <small className='float-end'>
                <a href="/#" className='text-decoration-none'>Olvide la contraseña</a>
              </small>
            </FloatingLabel>
            <div className='d-grid gap-2 d-md-block text-center mt-3'>
              <Button variant='primary'>Iniciar sesión</Button>
            </div>

          </Form>
        </Card.Body>
      </Card>
      <Footer/>

      {isLoading ? null :
        (user.role?.id === 1 && token ? <Navigate to='/admin' replace/> :
            user.role?.id === 2 && token ? <Navigate to='/um' replace/> :
              user.role?.id === 3 && token ? <Navigate to='/doctor' replace/> :
                user.role?.id === 4 && token ? <Navigate to='/assistant' replace/> :
                  <Navigate to='/404' replace/>
        )
      }
    </>
  );
}