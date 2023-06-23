import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";

import axiosClient from "../axios-client.js";
import { useUserContext } from "../contexts/UserProvider.jsx";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";



export default function DoctorLayout() {
  const {token, setToken, setUser, user} = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const modules = [
    {title: 'Citas', route: 'doctor/appointments'},
    {title: 'Pacientes', route: '/#'},
    {title: 'Materiales', route: '/#'},
    {title: 'Fórmulas y algoritmos', route: '/#'},
    {title: 'Siac Comunidad', route: '/#'},
    {title: 'Estadísticas', route: '/#'},
  ];

  useEffect(() => {
    return () => {
      axiosClient.get('auth-user')
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




  return (
    <>
      {isLoading ? <Loader/> :
        (user.role?.id === 3 && token ?
          <>
            <Navigation modules={modules} user={user}/>
            <div id='content-layout'>
              <main>
                <h1>Doctor Layout</h1>
                <Outlet/>
              </main>
              <Footer/>
            </div>
          </>
          : (token ? <Navigate to='/401' replace/> : <Navigate to='/login' replace/>))
      }
    </>
  );
}