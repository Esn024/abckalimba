import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { AppContext } from './AppContext';

const Registration = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { userId, setUserId, createNewUser } = useContext(AppContext);

  const form = useRef(null);

  return (
    <Wrapper>
      <Text>Registration Form</Text>
      <form onSubmit={handleSubmit(createNewUser)}>
        <input type='text' placeholder='Username' {...register('username')} />

        <input type='email' placeholder='Email' {...register('email')} />

        <input type='submit' value='Submit' />

        {/* {
          // display message if any errors with sign up
          serverResponse && serverResponse.status !== 200 && (
            <p>{serverResponse.message}</p>
          )
        } */}
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
