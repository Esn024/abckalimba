import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useCurrentUser from '../hooks/use-current-user.hook.js';

import { AppContext } from './AppContext';

const MyUserInfo = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const {
    userId,
    setUserId,
    createNewUser,
    updateUser,
    deleteUser,
    dateFromMs,
  } = useContext(AppContext);

  const [currentUser] =
    useCurrentUser(userId); /* Return user details from API call */

  return (
    <Wrapper>
      <Text>
        {!userId
          ? 'Please fill out the required information below.'
          : 'You can edit your user info below.'}
      </Text>
      {currentUser && (
        <SmallerText>
          Account created on: {dateFromMs(currentUser.created)}
        </SmallerText>
      )}
      <form
        onSubmit={
          !userId ? handleSubmit(createNewUser) : handleSubmit(updateUser)
        }
      >
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser && currentUser.username}
          {...register('username', { required: true, maxLength: 30 })}
        />
        {errors.username && <span>This field is required</span>}

        <input
          type='email'
          placeholder='Email'
          defaultValue={currentUser && currentUser.email}
          {...register('email', { required: true })}
        />
        {errors.email && <span>This field is required</span>}

        <textarea
          defaultValue={currentUser && currentUser.about}
          {...register('about')}
          placeholder='A few words about yourself (optional)'
        ></textarea>

        <input type='submit' value='Submit' />

        {userId && (
          <input
            type='submit'
            value='Delete User'
            onClick={() => deleteUser(userId)}
          />
        )}
      </form>
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px auto;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  textarea {
    width: 100%;
    height: 100px;
    margin: 5px;
    padding: 12px;
  }
  input {
    width: 100%;
    margin: 5px;
  }
`;

const Text = styled.p`
  color: black;
  font-family: var(--font-heading);
  font-size: 20px;
  text-align: center;
  margin: 12px 0 0 24px;
  margin-bottom: 20px;
`;

const SmallerText = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: 24px;
  text-align: center;
  margin: 12px 0 0 24px;
`;

export default MyUserInfo;
