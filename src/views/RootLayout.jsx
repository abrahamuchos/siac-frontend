import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";

import { useUserContext } from "../contexts/UserProvider.jsx";
import axiosClient from "../axios-client.js";
import ErrorAlert from "../components/alerts/ErrorAlert.jsx";


export default function RootLayout() {
  const {token, user, setUser} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    axiosClient.get('/auth-user')
      .then(({data}) => {
        setUser(data.user);
        setIsLoading(false)
      })
      .catch((err) => {
        setIsLoading(false)
        setError(err)
      });
  }, []);


  return (
    <>
      {isLoading ? <div></div> :
        (user.role?.id === 1  && token? <Navigate to='/admin' replace/> :
            user.role?.id === 2 && token ? <Navigate to='/um/appointments' replace/> :
              user.role?.id === 3 && token ? <Navigate to='/doctor' replace/> :
                user.role?.id === 4 && token ? <Navigate to='/assistant/appointments' replace/> :
                  <Navigate to='/login' replace/>
        )
      }
      {error ?
        <ErrorAlert err={error.response}/> : ''
      }
    </>
  );
}