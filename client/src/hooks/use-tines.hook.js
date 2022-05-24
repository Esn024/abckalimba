import { useState, useEffect } from 'react';

//custom hook for setting the tines
const useTines = (numberOfTines = 7) => {
  const [tines, setTines] = useState(null);

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
      setTines(null);
    };
  }, [userId]);

  return [tines, setTines];
};

export default useTines;
