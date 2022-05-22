import { useState, useEffect } from 'react';

//custom hook for getting info on a user that isn't yourself
const useOtherUser = (username) => {
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    // fetch user info
    const fetchOtherUser = async (username) => {
      const response = await fetch(`/api/users/${username}`);
      const resJSON = await response.json();
      const user = resJSON.data;

      // create a new object that removes the email field (don't want to publically display emails for other users)
      const userPublicInfo = {
        username,
        projectIds: user.projectIds,
      };

      // update the other user
      setOtherUser(userPublicInfo);
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
