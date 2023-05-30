import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import router from "./routes/router.jsx";
import { ContextProvider } from "./contexts/UserProvider.jsx";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router}/>
    </ContextProvider>
  </React.StrictMode>,
)
