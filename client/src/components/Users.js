import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import useUsers from '../hooks/use-users.hook.js';
import useArrayOfObjectsSortedByField from '../hooks/use-array-of-objects-sorted-by-field.hook.js';

import { AppContext } from './AppContext';

const PublicProjects = () => {
  const { dateFromMs } = useContext(AppContext);
  const [users, setUsers] = useUsers();
  const [fieldToSort, setFieldToSort] = useState('created');
  const [sortDirection, setSortDirection] = useState(1);
  const [sortedUsers] = useArrayOfObjectsSortedByField(
    users,
    fieldToSort,
    sortDirection
  );

  const setSort = (fieldSelected) => {
    fieldToSort !== fieldSelected
      ? setFieldToSort(fieldSelected)
      : setSortDirection(sortDirection * -1);
  };

  const displayArrow = (fieldSelected) => {
    return fieldToSort === fieldSelected
      ? sortDirection > 0
        ? '⭡'
        : '⭣'
      : '⭥';
  };

  return (
    <Wrapper>
      <h2>Users</h2>
      {sortedUsers ? (
        <StyledTable>
          <thead>
            <tr>
              <th onClick={() => setSort('username')}>
                Username {displayArrow('username')}
              </th>
              <th onClick={() => setSort('created')}>
                Created {displayArrow('created')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((u, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Link to={`/user/${u.username.toLowerCase()}`}>
                      {u.username}
                    </Link>
                  </td>
                  <td>{dateFromMs(u.created)}</td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      ) : (
        <p>Loading</p>
      )}
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px auto;
  height: 660px;
`;

const StyledTable = styled.table`
  margin: 20px 0 0 0;
  td {
    padding: 0 10px;
  }

  th {
    padding: 0 10px 10px 10px;
  }
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: var(--color-alabama-crimson);
`;

export default PublicProjects;
