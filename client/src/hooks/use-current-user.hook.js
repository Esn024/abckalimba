import { useState, useEffect } from 'react';

//custom hook for getting info on a current user. Requires knowing the user's ID.
const useCurrentUser = (userId) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // fetch user info
    const fetchCurrentUser = async (userId) => {
      const response = await fetch(`/api/users/id/${userId}`);
      const resJSON = await response.json();
      const user = resJSON.data;

      // update the current user
      setCurrentUser(user);
    };

    // if there is a user id, run the fetchCurrentUser function
    if (userId) {
      fetchCurrentUser(userId);
    }

    // cleanup
    return () => {
      setCurrentUser(null);
    };
  }, [userId]);

  return [currentUser, setCurrentUser];
};

export default useCurrentUser;
