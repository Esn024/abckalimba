import React, { useContext } from 'react';

import useProjects from '../hooks/use-projects.hook.js';

import { AppContext } from './AppContext';

import SortableTable from './SortableTable';

// if userId is passed in, then it gets ALL projects for that Id (including private ones),
// if username passed in, it gets that user's public projects
// if neither is passed in, it gets all public projects
const Projects = ({ userId, username }) => {
  const { dateFromMs } = useContext(AppContext);
  const [projects, setProjects] = useProjects(username, userId);

  return (
    <SortableTable
      tableName={username ? null : userId ? 'Your Projects' : 'Public Projects'}
      objArr={projects}
      tableColumnsTemplate={[
        {
          keyForColumn: 'projectName',
          headingName: 'Project Name',
          cellDataText(p) {
            return p.projectName ? p.projectName : 'Untitled';
          },
          cellDataLink(p) {
            // if userId is included, link to the myprojects URL
            return userId
              ? `/myprojects/${p.projectId}`
              : `/projects/${p.projectId}`;
          },
        },
        !username &&
          !userId && {
            keyForColumn: 'username',
            headingName: 'Username',
            cellDataText(p) {
              return p.username;
            },
            cellDataLink(p) {
              return `/users/${p.username.toLowerCase()}`;
            },
          },
        {
          keyForColumn: 'toneRowStr',
          headingName: 'Tone Row',
          cellDataText(p) {
            return p.toneRowStr;
          },
        },
        {
          keyForColumn: 'created',
          headingName: 'Created',
          cellDataText(p) {
            return dateFromMs(p.created);
          },
        },
        !!userId && {
          keyForColumn: 'projectVisibility',
          headingName: 'Project Visibility',
          cellDataText(p) {
            return p.projectVisibility;
          },
        },
      ]}
      defaultKeyToSortBy={'projectName'}
    />
  );
};

export default Projects;
