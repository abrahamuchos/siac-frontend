import React, { useEffect, useState } from 'react';
import { useUserContext } from "../contexts/UserProvider.jsx";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client.js";

export default function AdminLayout() {
  const {token, setToken, setUser, user} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    return () => {
      axiosClient.get('auth_user')
        .then(({data}) => {
          setUser(data.user)
          setIsLoading(false)
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setUser({});
            setToken(null);
            setIsLoading(false)
          }
        });
    };
  }, []);

  /**
   * Logout user
   */
  const handleLogout = () => {
    axiosClient.get('/logout')
      .then(() => {
        setToken(false);
        setUser({});
      })
      .catch((err) => {
        console.error(err);
      })
  }

  return (
    <div>
      {isLoading ? <h1>Cargando ... </h1> :
        (user.role?.id === 1 && token ?
          <>
            <h1>Admin Layout</h1>
            <Outlet/>
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </> : (token ? <Navigate to='/401' replace /> : <Navigate to='/login' replace /> ))
      }
    </div>
  );
}