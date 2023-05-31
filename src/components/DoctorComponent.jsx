import React, { useState } from 'react';
import { Alert, Button, Card, Form, Modal } from "react-bootstrap";
import {ReactComponent as IconActivity} from '../assets/icons/activity.svg';

export default function DoctorComponent(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='mb-5 mx-5 p-4'>
      <h1>Doctor Component</h1>
      <h2>Doctor Component</h2>
      <h3>Doctor Component</h3>
      <h4>Doctor Component</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore impedit placeat quaerat! Ab architecto et
        illum ipsa libero tempore vitae. Alias culpa et explicabo odio optio quod repudiandae sed suscipit.</p>

      <Form>
        <Form.Group>
          <Form.Label>Input text</Form.Label>
          <Form.Control type="password" placeholder="Enter email"/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Check type='switch' label='Something'></Form.Check>
        <Form.Check type='checkbox' label='Something' disabled></Form.Check>
      </Form>

      <Card>
        <Card.Body>
          <h1>Lorem Ipsum</h1>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aperiam architecto atque distinctio
          dolorem doloribus est fugiat itaque, odit optio provident quaerat quis rem? Commodi laboriosam odit
          perspiciatis tempore voluptates.
          <div className="float-end mt-4">
            <Button variant='secondary'>Lorem</Button>

          </div>
        </Card.Body>
      </Card>
      <IconActivity style={{ width:'1rem', height:'1rem' }}/>

      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
}