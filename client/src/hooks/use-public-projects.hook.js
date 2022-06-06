import { useState, useEffect } from 'react';

//custom hook for getting info for list of public projects. If there is a username, get it just for that username
const usePublicProjects = (username = null) => {
  const [publicProjects, setPublicProjects] = useState(null);

  useEffect(() => {
    // fetch public projects
    const fetchPublicProjects = async () => {
      // console.log('fetching public projects');
      // console.log({ username });
      const response = !username
        ? await fetch(`/api/projects`)
        : await fetch(`/api/users/${username}/projects`);
      const resJSON = await response.json();
      const projects = resJSON.data;

      // console.log({ projects });

      // update the public projects
      setPublicProjects(projects);
    };

    fetchPublicProjects();

    // cleanup
    return () => {
      setPublicProjects(null);
    };
  }, [username]);

  return [publicProjects, setPublicProjects];
};

export default usePublicProjects;
