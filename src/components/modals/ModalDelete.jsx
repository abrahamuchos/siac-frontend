import React, { useEffect, useState } from 'react';
import { Button, Modal } from "react-bootstrap";

/**
 *
 * @param children
 * @param {string} title
 * @param {string} question
 * @param {boolean} modalDelete - show or hide modal
 * @param {function} setModalDelete - set state show or hide modal
 * @return {JSX.Element}
 * @constructor
 */
export default function ModalDelete({children, title, question, modalDelete, setModalDelete}) {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    let interval;
    if (counter > 0 && modalDelete) {
      interval = setInterval(() => {
        setCounter(c => c - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [modalDelete, counter]);

  return (
    <Modal show={modalDelete} onHide={() => setModalDelete(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{question}</p>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' className='me-3' onClick={() => setModalDelete(false)}>Cancelar</Button>
        <Button variant='danger' disabled={counter > 0} form='form-reason-delete' type='submit'>
          {'(' + counter + ') '}Sí, eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}