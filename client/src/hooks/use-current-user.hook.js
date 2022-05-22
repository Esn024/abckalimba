import { useState, useEffect } from 'react';

//custom hook for getting info on a current user. Requires knowing the user's ID.
const useCurrentUser = (id) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // fetch user info
    const fetchCurrentUser = async (id) => {
      const response = await fetch(`/api/users/id/${id}`);
      const resJSON = await response.json();
      const user = resJSON.data;

      // update the current user
      setCurrentUser(user);
    };

    // if there is a user id, run the fetchCurrentUser function
    if (id) {
      fetchCurrentUser(id);
    }

    // cleanup
    return () => {
      setCurrentUser(null);
    };
  }, [id]);

  return [currentUser, setCurrentUser];
};

export default useCurrentUser;
