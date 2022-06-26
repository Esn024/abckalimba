import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useLocalCurrentUser from '../hooks/use-local-current-user.hook.js';

import { AppContext } from './AppContext';
import Projects from './Projects';

const MyUserInfo = () => {
  const {
    userId,
    currentUser,
    createNewUser,
    updateUser,
    deleteUser,
    dateFromMs,
    deepEqual,
  } = useContext(AppContext);

  const [localCurrentUser, setLocalCurrentUser] =
    useLocalCurrentUser(currentUser);

  const userHasUnsavedInfo =
    currentUser &&
    localCurrentUser &&
    !deepEqual(localCurrentUser, currentUser);

  // console.log({ localCurrentUser });
  // console.log({ currentUser });
  // console.log(deepEqual(localCurrentUser, currentUser));

  return (
    <Wrapper>
      {currentUser && (
        <SmallerText>
          Account created on: {dateFromMs(currentUser.created)}
        </SmallerText>
      )}
      {currentUser?.modified && (
        <SmallerText>
          Account modified on: {dateFromMs(currentUser.modified)}
        </SmallerText>
      )}
      <SmallerText>
        {!userId
          ? 'Please fill out the required information below.'
          : 'You can edit your user info below.'}{' '}
        {userHasUnsavedInfo && (
          <ColoredText>You have unsaved changes.</ColoredText>
        )}
      </SmallerText>
      <form>
        <input
          type='text'
          placeholder='Username'
          value={localCurrentUser ? localCurrentUser.username : ''}
          onChange={(ev) => {
            setLocalCurrentUser({
              ...localCurrentUser,
              username: ev.target.value,
            });
          }}
        />

        <input
          type='email'
          placeholder='Email'
          value={localCurrentUser ? localCurrentUser.email : ''}
          onChange={(ev) => {
            setLocalCurrentUser({
              ...localCurrentUser,
              email: ev.target.value,
            });
          }}
        />

        <textarea
          value={localCurrentUser ? localCurrentUser.about : ''}
          placeholder='A few words about yourself (optional)'
          onChange={(ev) => {
            setLocalCurrentUser({
              ...localCurrentUser,
              about: ev.target.value,
            });
          }}
        ></textarea>

        <input
          type='submit'
          value={userId ? 'Submit Changes' : 'Register'}
          // disable button if required fields are empty or invalid, or if existing user has not made any changes to their existing data
          disabled={
            (userId && !userHasUnsavedInfo) ||
            localCurrentUser?.username === '' ||
            !localCurrentUser?.email?.includes('@')
          }
          onClick={(ev) => {
            ev.preventDefault();
            !userId
              ? createNewUser(localCurrentUser)
              : updateUser(localCurrentUser);
          }}
        />

        {userId && (
          <input
            type='submit'
            value='Delete User'
            onClick={(ev) => {
              ev.preventDefault();
              const text = 'Are you sure you want to delete this account?';
              if (window.confirm(text) == true) {
                deleteUser(userId);
              }
            }}
          />
        )}
      </form>
      <Projects userId={userId} username={null} />
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

const ColoredText = styled.span`
  color: var(--color-dark-green);
`;

const SmallerText = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  text-align: center;
  margin-bottom: 12px;
`;

export default MyUserInfo;
