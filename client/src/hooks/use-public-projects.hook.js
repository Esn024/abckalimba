import { useState, useEffect } from 'react';

//custom hook for getting info for list of public projects
const usePublicProjects = () => {
  const [publicProjects, setPublicProjects] = useState(null);

  useEffect(() => {
    // fetch public projects
    const fetchPublicProjects = async () => {
      // console.log('fetching public projects');
      const response = await fetch(`/api/projects`);
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
  }, []);

  return [publicProjects, setPublicProjects];
};

export default usePublicProjects;
