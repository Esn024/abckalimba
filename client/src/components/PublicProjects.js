import React, { useContext } from 'react';

import usePublicProjects from '../hooks/use-public-projects.hook.js';

import { AppContext } from './AppContext';

import SortableTable from './SortableTable';

const PublicProjects = () => {
  const { dateFromMs } = useContext(AppContext);
  const [publicProjects, setPublicProjects] = usePublicProjects();

  return (
    <SortableTable
      tableName={'Public Projects'}
      objArr={publicProjects}
      tableColumnsTemplate={[
        {
          keyForColumn: 'projectName',
          headingName: 'Project Name',
          cellDataText(p) {
            return p.projectName ? p.projectName : 'Untitled';
          },
          cellDataLink(p) {
            return `/project/${p.projectId}`;
          },
        },
        {
          keyForColumn: 'username',
          headingName: 'Username',
          cellDataText(p) {
            return p.username;
          },
          cellDataLink(p) {
            return `/user/${p.username.toLowerCase()}`;
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
      ]}
      defaultKeyToSortBy={'projectName'}
    />
  );
};

export default PublicProjects;
