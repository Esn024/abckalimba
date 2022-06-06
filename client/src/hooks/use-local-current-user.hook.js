import { useState, useEffect } from 'react';

//custom hook for a local copy of currentUser. For use in the "my user info" page (it only saves changes if the user clicks "submit")
const useLocalCurrentUser = (currentUser) => {
  const [localCurrentUser, setLocalCurrentUser] = useState(null);

  useEffect(() => {
    // update the local current user
    setLocalCurrentUser({ ...currentUser });

    // cleanup
    return () => {
      setLocalCurrentUser(null);
    };
  }, [currentUser]);

  return [localCurrentUser, setLocalCurrentUser];
};

export default useLocalCurrentUser;
