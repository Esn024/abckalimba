import React, { createContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext();

// context provider
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const navigate = useNavigate();

  // return human-readable date from milliseconds since 1970
  const dateFromMs = (ms) => {
    const date = new Date(ms);
    const year = date.getYear();
    const month = date.getMonth();
    const day = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${year}-${month}-${day} ${h}:${m}:${s}`;
  };

  //create new user
  //have this as an onsubmit on create new user form. "form" is the useRef reference to the form from which user data is being submitted
  const createNewUser = (formData) => {
    // console.log({ formData });

    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ ...formData, created: Date.now() }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const { status, message, data } = json;

        if (status == 200) {
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

  // handle update user (send properly-formatted PUT request to api/users/id/:id)
  const updateUser = (formData) => {
    console.log({ formData });

    fetch(`/api/users/id/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, modified: Date.now() }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message, data } = json;
        // check that the request got successfully through to server
        if (status === 202) {
          // Display confirmation message that user info was updated.
          // TODO change this to something other than alert
          alert(`Successfully changed user info for ${formData.username}`);
        } else {
          // if it didn't go through, show an error.
          throw new Error({ status, message, data });
        }
      });
  };

  // handle delete user (send properly-formatted PUT request to api/users/id/:id)
  const deleteUser = (formData) => {
    fetch(`/api/users/id/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message, data } = json;
        // check that the request got successfully through to server
        if (status === 207) {
          // remove the userId from localstorage
          localStorage.removeItem('userId');
          // Display confirmation message that user info was deleted.
          // TODO change this to something other than alert
          alert(`Successfully deleted user!`);
        } else {
          // if it didn't go through, show an error.
          throw new Error({ status, message, data });
        }
      });
  };

  const permissionToEditProject = (currentUser, project) => {
    // allow only the project creator or the site Admin to edit a project
    return (
      currentUser.username === project.username ||
      currentUser.username === 'Admin'
    );
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        dateFromMs,
        createNewUser,
        updateUser,
        deleteUser,
        permissionToEditProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
