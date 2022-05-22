import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { AppContext } from './AppContext';

const Registration = () => {
  const { userId, setUserId } = useContext(AppContext);

  const navigate = useNavigate();
  const [serverResponse, setServerResponse] = useState();

  const form = useRef(null);

  //create new user
  //have this as an onsubmit on create new user form. "form" is the useRef reference to the form from which user data is being submitted
  const createNewUser = (ev) => {
    ev.preventDefault();

    const formData = new FormData(form.current);

    fetch('/api/users', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const { status, message, data } = json;

        if (status == 200) {
          setServerResponse(json);
          setUserId(data._id);
          // add it to localStorage so it persists even after browser is closed
          localStorage.setItem('userId', data._id);

          // return to homepage
          navigate('/');
        } else {
          // TODO remove console log
          console.log('There was an error', { status, message, data });
        }
      });
  };

  return (
    <Wrapper>
      <Text>Registration Form</Text>
      <form ref={form} onSubmit={createNewUser}>
        <input type='text' name='user[username]' placeholder='Username' />

        <input type='email' name='user[email]' placeholder='Email' />

        <input type='submit' name='Register' />

        {
          // display message if any errors with sign up
          serverResponse && serverResponse.status !== 200 && (
            <p>{serverResponse.message}</p>
          )
        }
      </form>
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  margin: 24px auto;
`;

const Text = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: 36px;
  text-align: center;
  margin: 12px 0 0 24px;
`;

export default Registration;
