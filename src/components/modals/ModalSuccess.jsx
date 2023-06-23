import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {string} classname
 * @param {boolean} show
 * @param {string} title
 * @param {string} message
 * @param {string} url
 * @return {JSX.Element}
 * @constructor
 */
export default function ModalSuccess({classname, show = false, title, message, url = '/'}) {
  const navigate = useNavigate();
  return (
    <Modal show={show} className={classname}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => navigate(url)}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}