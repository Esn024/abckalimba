import React, { createContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const AppContext = createContext();

// context provider
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

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

  // handle update user (send properly-formatted PUT request to api/users/:id)
  const updateUser = () => {
    // fetch(`/items/buy`, {
    //   method: 'PUT',
    //   body: JSON.stringify({
    //     email,
    //     projectIds,
    //   }),
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     const { status, message, data } = json;
    //     // check that the request got successfully through to server
    //     if (status === 202) {
    //       // Display confirmation message that user info was updated.
    //       // TODO change this to something other than alert
    //       alert(`Successfully changed user info for ${username}`);
    //     } else {
    //       // if it didn't go through, show an error.
    //       throw new Error({ status, message, data });
    //     }
    //   });
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
        updateUser,
        permissionToEditProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
