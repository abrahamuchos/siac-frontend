import React from 'react';
import { Form } from "react-bootstrap";


export default function DoctorComponent(props) {
  return (
    <div className='mb-5 mx-5 p-4' style={{backgroundColor: 'white'}}>
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




    </div>
  );
}