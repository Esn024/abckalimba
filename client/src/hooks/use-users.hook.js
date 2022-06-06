import { useState, useEffect } from 'react';

//custom hook for getting info for list of public projects
const useUsers = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    // fetch users
    const fetchUsers = async () => {
      // console.log('fetching public projects');
      const response = await fetch(`/api/users`);
      const resJSON = await response.json();
      const users = resJSON.data;

      // console.log({ users });

      // update the users
      setUsers(users);
    };

    fetchUsers();

    // cleanup
    return () => {
      setUsers(null);
    };
  }, []);

  return [users, setUsers];
};

export default useUsers;
