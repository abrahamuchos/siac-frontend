/**
 * @typedef {Object} MyErrors
 * @property {boolean} error
 * @property {number} status
 * @property {number} code
 * @property {string} message
 * @property {string} details
 */
import React from 'react';
import { Alert } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";


export default function ErrorAlert({err}) {
  const status = err.status;
  const code = err.data.code;
  const message = err.data.message;
  const details = err.data.details;
  let dismissible = true;
  let cta = {
    url: null,
    message: null,
    reload: null
  }
  /**@type {string|null} redirect **/
  let redirect = null;

  console.error({
    status: status,
    code: code,
    message: message,
    details: details
  });

  const reloadPage = () =>{
    window.location.reload();
  }

  if (status === 403 && code === 10400) {
    redirect = '/403';

  } else if (status === 403 && typeof code === 'undefined') {
    redirect = '/403';

  }else if(status === 404 &&  typeof code === 'undefined' ) {
    redirect = '/404';

  }else if(status === 404 && code === 10001) {
    cta.url = '/';
    cta.message = 'Ir atrás'
    dismissible = false;

  }else if (status === 404 && code === 10002){
    cta.url = '/';
    cta.message = 'Ir atrás'
    dismissible = false;

  } else if (status === 422){
    cta.message = message

  } else if (status === 500 && code === 10500) {
    cta.reload = true
    cta.message = 'Refrescar la pagina'

  }else if (status === 500 && code === 10501) {
    cta.reload = true
    cta.message = 'Refrescar la pagina'

  }


  return (
    <>
      {redirect ? <Navigate to={redirect} replace={true}/>
        : <Alert variant='danger' dismissible={dismissible}>
          <Alert.Heading>Error</Alert.Heading>
          <div>{message}</div>
          {cta ?
            <Link to={cta.url} className='alert-link' onClick={() => cta.reload ? reloadPage() : null }>
              {cta.message}
            </Link>
            : ''
          }
        </Alert>

      }
    </>
  );
}
