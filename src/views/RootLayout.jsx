import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";

import { useUserContext } from "../contexts/UserProvider.jsx";
import axiosClient from "../axios-client.js";


export default function RootLayout() {
  const {token, user, setUser} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    axiosClient.get('/auth-user')
      .then(({data}) => {
        setUser(data.user);
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      });
  }, []);


  return (
    <>
      {isLoading ? <div></div> :
        (user.role?.id === 1  && token? <Navigate to='/admin' replace/> :
            user.role?.id === 2 && token ? <Navigate to='/um' replace/> :
              user.role?.id === 3 && token ? <Navigate to='/doctor' replace/> :
                user.role?.id === 4 && token ? <Navigate to='/assistant' replace/> :
                  <Navigate to='/login' replace/>
        )
      }
    </>
  );
}