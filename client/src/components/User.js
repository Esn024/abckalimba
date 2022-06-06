import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';

import usePublicProjects from '../hooks/use-public-projects.hook.js';
import useOtherUser from '../hooks/use-other-user.hook.js';
import useArrayOfObjectsSortedByField from '../hooks/use-array-of-objects-sorted-by-field.hook.js';

import { AppContext } from './AppContext';

const User = () => {
  const { lowercaseusername } = useParams();

  const { dateFromMs } = useContext(AppContext);

  const [otherUser, setOtherUser] = useOtherUser(lowercaseusername);
  const [publicProjects, setPublicProjects] =
    usePublicProjects(lowercaseusername);
  const [fieldToSort, setFieldToSort] = useState('created');
  const [sortDirection, setSortDirection] = useState(1);
  const [sortedPublicProjects] = useArrayOfObjectsSortedByField(
    publicProjects,
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
      <h1>{otherUser && otherUser.username}</h1>
      <About>{otherUser && otherUser.about}</About>
      {sortedPublicProjects ? (
        <StyledTable>
          <thead>
            <tr>
              <th onClick={() => setSort('projectName')}>
                Project Name {displayArrow('projectName')}
              </th>
              <th onClick={() => setSort('username')}>
                Username {displayArrow('username')}
              </th>
              <th onClick={() => setSort('toneRowStr')}>
                Tone Row {displayArrow('toneRowStr')}
              </th>
              <th onClick={() => setSort('created')}>
                Created {displayArrow('created')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPublicProjects.map((p, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Link to={`/project/${p.projectId}`}>
                      {p.projectName ? p.projectName : 'Untitled'}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/user/${p.username.toLowerCase()}`}>
                      {p.username}
                    </Link>
                  </td>
                  <td>{p.toneRowStr}</td>
                  <td>{dateFromMs(p.created)}</td>
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

const About = styled.div`
  margin: 20px 0;
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

export default User;
