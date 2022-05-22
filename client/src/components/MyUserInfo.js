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
      <Text>{!userId ? 'Registration Form' : 'Edit My User Info'}</Text>
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

        <label htmlFor='about'>A few words about yourself (optional):</label>
        <textarea
          id='about'
          defaultValue={currentUser && currentUser.about}
          {...register('about')}
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
  margin: 24px auto;
`;

const Text = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: 36px;
  text-align: center;
  margin: 12px 0 0 24px;
`;

const SmallerText = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: 24px;
  text-align: center;
  margin: 12px 0 0 24px;
`;

export default MyUserInfo;
