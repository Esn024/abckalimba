import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import useUsers from '../hooks/use-users.hook.js';
import useArrayOfObjectsSortedByField from '../hooks/use-array-of-objects-sorted-by-field.hook.js';

import { AppContext } from './AppContext';

//tableTemplate should be formatted like so:
//[{keyForTable, headingName, cellDataContent}, {...}, {...}]
const SortableTable = (
  tableName,
  objArr,
  tableColumnsTemplate,
  defaultKeyToSortBy,
  defaultSortDirection = 1
) => {
  // const { dateFromMs } = useContext(AppContext);
  // const [users, setUsers] = useUsers();
  const [fieldToSort, setFieldToSort] = useState(defaultKeyToSortBy);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [sortedArray] = useArrayOfObjectsSortedByField(
    objArr,
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
      <h2>{tableName}</h2>
      {sortedArray ? (
        <StyledTable>
          <thead>
            <tr>
              {tableColumnsTemplate.map((columnTemplate, i) => {
                return (
                  <th
                    onClick={() => setSort(columnTemplate.keyForTable)}
                    key={'th' + i}
                  >
                    {columnTemplate.headingName}{' '}
                    {displayArrow(columnTemplate.keyForTable)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedArray.map((rowData, rowIndex) => {
              return (
                <tr key={'tr' + rowIndex}>
                  {tableColumnsTemplate.map((columnTemplate, columnIndex) => {
                    return (
                      <td key={'tr' + rowIndex + 'td' + columnIndex}>
                        {columnTemplate.cellDataContent(rowData)}
                      </td>
                    );
                  })}
                  {/* //cellDataText */}
                  {/* <td>
                    <Link to={`/user/${k.username.toLowerCase()}`}>
                      {k.username}
                    </Link>
                  </td>
                  <td>{dateFromMs(k.created)}</td> */}
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

export default SortableTable;
