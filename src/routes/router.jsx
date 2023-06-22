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
import Appointments from "../components/appointments/Appointments.jsx";
import Appointment from "../components/appointments/Appointment.jsx";
import Forbidden from "../views/Forbidden.jsx";


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
    children: [
      {
        index: true,
        element: <Appointments/>
      },
      {
        path: 'appointment',
        element: <Appointment/>
      },
      {
        path: 'appointment/:id',
        element: <Appointment/>
      }
    ]
  },

  {
    path: '/doctor', element: <DoctorLayout/>,
    children: [
      {
        path: 'appointments',
        element: <Appointments/>
      },
      {
        path: 'appointment',
        element: <Appointment/>
      },
      {
        path: 'appointment/:id',
        element: <Appointment/>
      }
    ]
  },

  {
    path: '/assistant', element: <AssistantLayout/>,
    children: [
      {
        index: true,
        element: <Appointments/>
      },
      {
        path: 'appointment',
        element: <Appointment/>
      },
      {
        path: 'appointment/:id',
        element: <Appointment/>
      }
    ]
  },

  {
    path: '/401', element: <Unauthorized/>
  },
  {
    path: '403', element: <Forbidden/>
  },
  {
    path: '*', element: <NotFound/>
  }


]);

export default router;