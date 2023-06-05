import { createBrowserRouter} from "react-router-dom";

import RootLayout from "../views/RootLayout.jsx";
import DoctorLayout from "../layouts/DoctorLayout.jsx";
import AssistantLayout from "../layouts/AssistantLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import MedicalUnitLayout from "../layouts/MedicalUnitLayout.jsx";

import Login from "../views/Login.jsx";
import Unauthorized from "../views/Unauthorized.jsx";
import NotFound from "../views/NotFound.jsx";
import ForgotPassword from "../views/ForgotPassword.jsx";
import ResetPassword from "../views/ResetPassword.jsx";

import AssistantComponent from "../components/AssistantComponent.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>
  },

  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/forgot',
    element: <ForgotPassword/>
  },
  {
    path: '/reset-password',
    element: <ResetPassword/>
  },

  {
    path: '/admin', element: <AdminLayout/>,
  },

  {
    path: '/um', element: <MedicalUnitLayout/>,
  },

  {
    path: '/doctor', element: <DoctorLayout/>,
    // children: [
    //   {
    //     index: true,
    //     element: <DoctorComponent/>
    //   }
    // ]
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