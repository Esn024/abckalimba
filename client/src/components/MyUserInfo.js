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
    currentUser,
    createNewUser,
    updateUser,
    deleteUser,
    dateFromMs,
  } = useContext(AppContext);

  return (
    <Wrapper>
      {currentUser && (
        <SmallerText>
          Account created on: {dateFromMs(currentUser.created)}
        </SmallerText>
      )}
      <SmallerText>
        {!userId
          ? 'Please fill out the required information below.'
          : 'You can edit your user info below.'}
      </SmallerText>
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

const SmallerText = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  text-align: center;
  margin-bottom: 12px;
`;

export default MyUserInfo;
