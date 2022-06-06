import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import useToneRows from '../hooks/use-tone-rows.hook.js';
import useArrayOfObjectsSortedByField from '../hooks/use-array-of-objects-sorted-by-field.hook.js';

import { AppContext } from './AppContext';

const ToneRows = () => {
  const { dateFromMs } = useContext(AppContext);
  const [toneRows, setToneRows] = useToneRows();
  const [fieldToSort, setFieldToSort] = useState('toneRowStr');
  const [sortDirection, setSortDirection] = useState(1);
  const [sortedToneRows] = useArrayOfObjectsSortedByField(
    toneRows,
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
      <h2>Tone Rows</h2>
      {sortedToneRows ? (
        <StyledTable>
          <thead>
            <tr>
              <th onClick={() => setSort('toneRowStr')}>
                Tone Row {displayArrow('toneRowStr')}
              </th>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            {sortedToneRows.map((t, i) => {
              return (
                <tr key={i}>
                  <td>
                    <Link to={`/tonerow/${t.toneRowId}`}>{t.toneRowStr}</Link>
                  </td>
                  <td>
                    {t.projectIds.map((id, index) => {
                      return (
                        <span key={index}>
                          <Link to={`/project/${id}`}>{id}</Link>{' '}
                        </span>
                      );
                    })}
                  </td>
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

export default ToneRows;
