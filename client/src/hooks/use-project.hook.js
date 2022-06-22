import { useState, useEffect } from 'react';

//custom hook for getting info of a project (public or private)
const useProject = (projectId = null, created = null, currentUserId = null) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    // fetch user info
    const fetchProject = async (projectId, created) => {
      let resJSON;

      if (projectId) {
        const response = !created
          ? await fetch(`/api/projects/${projectId}`)
          : await fetch(`/api/private-projects/${projectId}/${created}`, {
              method: 'GET',
              body: JSON.stringify({ currentUserId }),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
        resJSON = await response.json();

        const loadedProject = projectId
          ? resJSON.data
          : {
              projectName: '',
              projectDescription: '',
              projectVisibility: 'private',
              toneRowStr: '5 tones (c d e f g) [awsed]',
              musicalSections: [
                {
                  letterId: 'A',
                  description: '',
                  numberOfMeasures: 2,
                  measures: [
                    [
                      [1, 0, 0, 0],
                      [0, 2, 0, 0],
                      [0, 0, 1, 0],
                      [0, 0, 0, 2],
                    ],
                    [
                      [0, 1, 0, 0],
                      [0, 0, 2, 0],
                      [0, 1, 0, 0],
                      [2, 0, 0, 0],
                    ],
                  ],
                },
              ],
              orderOfSections: 'AA',
              tempo: 180,
              key: 'C',
              beatsPerMeasure: 4,
            };

        // console.log({ loadedProject });
        // update the project
        loadedProject && setProject(loadedProject);
      }
    };

    // if there is a projectId, run the fetchOtherUser function
    if (projectId) {
      fetchProject(projectId, created);
    }

    // cleanup
    return () => {
      setProject(null);
    };
  }, [projectId, created, currentUserId]);

  return [project, setProject];
};

export default useProject;
