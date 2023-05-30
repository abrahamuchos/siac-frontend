import React, { useState } from 'react';
import { useUserContext } from "../contexts/UserProvider.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function Login() {
  const {token, setToken, setUser, user} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    const payload = {
      email: 'celestino.moen@yahoo.com',
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
    <div>
      <h1>Login!!</h1>
      <button onClick={(e) => handleLogin(e)}>Login</button>
      { isLoading ? null :
        (user.role?.id === 1  && token? <Navigate to='/admin' replace/> :
            user.role?.id === 2 && token ? <Navigate to='/um' replace/> :
              user.role?.id === 3 && token ? <Navigate to='/doctor' replace/> :
                user.role?.id === 4 && token ? <Navigate to='/assistant' replace/> :
                  <Navigate to='/404' replace/>
        )

      }
    </div>
  );
}