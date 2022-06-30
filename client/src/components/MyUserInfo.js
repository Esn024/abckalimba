import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import useLocalCurrentUser from '../hooks/use-local-current-user.hook.js';

import { AppContext } from './AppContext';
import Projects from './Projects';

const MyUserInfo = () => {
  const {
    userId,
    currentUser,
    handleSignIn,
    createNewUser,
    updateUser,
    deleteUser,
    dateFromMs,
    deepEqual,
  } = useContext(AppContext);

  const [localCurrentUser, setLocalCurrentUser] =
    useLocalCurrentUser(currentUser);

  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const userHasUnsavedInfo =
    currentUser &&
    localCurrentUser &&
    !deepEqual(localCurrentUser, {
      ...currentUser,
      password2: localCurrentUser.password2,
    });

  const passwordsMatch = localCurrentUser
    ? localCurrentUser.password === localCurrentUser.password2
    : true;

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
      {!userId && (
        <Wrapper>
          <input
            type='text'
            placeholder='Username'
            value={signInUsername}
            onChange={(ev) => {
              setSignInUsername(ev.target.value);
            }}
          />
          <input
            type='password'
            placeholder='Password'
            value={signInPassword}
            onChange={(ev) => {
              setSignInPassword(ev.target.value);
            }}
          />
          <InputButton
            type='submit'
            value='Sign In'
            // disable button if required fields are empty
            disabled={signInPassword === '' || signInUsername === ''}
            onClick={(ev) => {
              ev.preventDefault();
              handleSignIn(signInUsername, signInPassword);
            }}
          />
        </Wrapper>
      )}
      <SmallerText>
        {!userId
          ? 'Or, please fill out the required information below to register a new account:'
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

        <input
          type='password'
          placeholder='Password'
          value={localCurrentUser ? localCurrentUser.password : ''}
          style={{
            boxShadow: passwordsMatch ? '' : '0 0 3px red',
          }}
          onChange={(ev) => {
            setLocalCurrentUser({
              ...localCurrentUser,
              password: ev.target.value,
            });
          }}
        />

        <input
          type='password'
          placeholder='Repeat Password'
          value={localCurrentUser ? localCurrentUser.password2 : ''}
          style={{
            boxShadow: passwordsMatch ? '' : '0 0 3px red',
          }}
          onChange={(ev) => {
            setLocalCurrentUser({
              ...localCurrentUser,
              password2: ev.target.value,
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
        {!passwordsMatch && <ErrorText>Passwords don't match.</ErrorText>}
        <InputButton
          type='submit'
          value={userId ? 'Submit Changes' : 'Register'}
          // disable button if required fields are empty or invalid, or if existing user has not made any changes to their existing data, or if password is empty, or if passwords don't match
          disabled={
            (userId && !userHasUnsavedInfo) ||
            localCurrentUser?.username === '' ||
            !localCurrentUser?.email?.includes('@') ||
            localCurrentUser.password === '' ||
            !passwordsMatch
          }
          onClick={(ev) => {
            ev.preventDefault();
            const currentUserToSubmit = { ...localCurrentUser };
            delete currentUserToSubmit.password2;

            !userId
              ? createNewUser(currentUserToSubmit)
              : updateUser(currentUserToSubmit);
          }}
        />

        {userId && (
          <input
            type='submit'
            value='Delete User'
            onClick={(ev) => {
              ev.preventDefault();
              const text = 'Are you sure you want to delete this account?';
              if (window.confirm(text) === true) {
                deleteUser(userId);
              }
            }}
          />
        )}
      </form>
      {currentUser && <Projects userId={userId} username={null} />}
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
    width: 190px;
    margin: 5px 0;
  }
`;

const ColoredText = styled.span`
  color: var(--color-dark-green);
`;

const ErrorText = styled.span`
  color: var(--color-cadmium-red);
`;

const SmallerText = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  text-align: center;
  margin-bottom: 12px;
`;

const InputButton = styled.input`
  height: 24px;
  width: 195px;
  margin: 0;
`;

export default MyUserInfo;
