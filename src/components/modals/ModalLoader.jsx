import React from 'react';
import { Modal } from "react-bootstrap";

import EkgLoader from "../EkgLoader.jsx";

/**
 *
 * @param {boolean} show
 * @param {string} classname
 * @param {string} message
 * @return {JSX.Element}
 * @constructor
 */
export default function ModalLoader({show = false, classname, message}) {
  return (
    <Modal show={show} className={classname}>
      <Modal.Header>
        <Modal.Title>Cargando</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-3'>
          {message ?? 'Estamos procesando su solicitud'}
        </div>
        <EkgLoader/>
      </Modal.Body>
    </Modal>
  );
}