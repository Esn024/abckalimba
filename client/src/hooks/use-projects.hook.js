import { useState, useEffect } from 'react';

//custom hook for getting info for list of public projects. If there is a username, get it just for that username. If there is a userId, get list of all that user's projects
const useProjects = (username = null, userId = null) => {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    // fetch projects
    const fetchProjects = async () => {
      // console.log('fetching projects');
      // console.log({ username });
      // console.log({ userId });
      const response = userId
        ? await fetch(`/api/users/id/${userId}/projects`)
        : username
        ? await fetch(`/api/users/${username}/projects`)
        : await fetch(`/api/projects`);

      const resJSON = await response.json();
      const projectsData = resJSON.data;

      // console.log({ projects });

      // update the public projects
      setProjects(projectsData);
    };

    fetchProjects();

    // cleanup
    return () => {
      setProjects(null);
    };
  }, [username, userId]);

  return [projects, setProjects];
};

export default useProjects;
