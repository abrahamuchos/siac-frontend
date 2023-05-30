import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserProvider.jsx";

import DoctorLayout from "../layouts/DoctorLayout.jsx";
import AssistantLayout from "../layouts/AssistantLayout.jsx";
import Login from "../views/Login.jsx";
import DoctorComponent from "../components/DoctorComponent.jsx";
import AssistantComponent from "../components/AssistantComponent.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import MedicalUnitLayout from "../layouts/MedicalUnitLayout.jsx";
import Unauthorized from "../views/Unauthorized.jsx";
import NotFound from "../views/NotFound.jsx";
import RootLayout from "../views/RootLayout.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>
  },

  {
    path: '/login', element: <Login/>
  },

  {
    path: '/admin', element: <AdminLayout/>,
  },

  {
    path: '/um', element: <MedicalUnitLayout/>,
  },

  {
    path: '/doctor', element: <DoctorLayout/>,
    children: [
      {
        path: 'dashboard',
        element: <DoctorComponent/>
      }
    ]
  },

  {
    path: '/assistant', element: <AssistantLayout/>,
    children: [
      {
        path: 'dashboard',
        element: <AssistantComponent/>
      }
    ]
  },

  {
    path: '/401', element: <Unauthorized/>
  },

  {
    path: '*', element: <NotFound/>
  }


]);

export default router;