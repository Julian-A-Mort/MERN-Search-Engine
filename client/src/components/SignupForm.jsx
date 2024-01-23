import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../graphql/mutations';

import Auth from '../utils/auth';

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [addUser, { error }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({ variables: { ...userFormData } });
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);

      // Check if the error message is available in the response
      if (err.message) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong with your signup!");
      }
    }

    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          {errorMessage} {/* Display the error message */}
        </Alert>

        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={userFormData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type='email'
            name='email'
            placeholder='Enter your email'
            value={userFormData.email}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            placeholder='Enter your password'
            value={userFormData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
