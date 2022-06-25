import React, { useContext } from 'react';

import useUsers from '../hooks/use-users.hook.js';

import { AppContext } from './AppContext';

import SortableTable from './SortableTable';

const Users = () => {
  const { dateFromMs } = useContext(AppContext);
  const [users, setUsers] = useUsers();

  return (
    <SortableTable
      tableName={'Users'}
      objArr={users}
      tableColumnsTemplate={[
        {
          keyForColumn: 'username',
          headingName: 'Username',
          cellDataText(u) {
            return u.username;
          },
          cellDataLink(u) {
            return `/user/${u.username.toLowerCase()}`;
          },
        },
        {
          keyForTable: 'created',
          headingName: 'Created',
          cellDataText(u) {
            return dateFromMs(u.created);
          },
        },
      ]}
      defaultKeyToSortBy={'username'}
    />
  );
};

export default Users;
