import { useState, useEffect } from 'react';

//custom hook for getting public info of a user
const useOtherUser = (username) => {
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    // fetch user info
    const fetchOtherUser = async (username) => {
      const response = await fetch(`/api/users/${username}`);
      const resJSON = await response.json();
      const user = resJSON.data;

      // update the other user
      setOtherUser(user);
    };

    // if there is a username, run the fetchOtherUser function
    if (username) {
      fetchOtherUser(username);
    }

    // cleanup
    return () => {
      setOtherUser(null);
    };
  }, [username]);

  return [otherUser, setOtherUser];
};

export default useOtherUser;
