import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import useArrayOfObjectsSortedByField from '../hooks/use-array-of-objects-sorted-by-field.hook.js';

// a reusable template for a sortable table
// TODO still has a bug - when clicked for the first time, sorting doesn't work as it should
const SortableTable = ({
  tableName,
  objArr,
  tableColumnsTemplate,
  defaultKeyToSortBy,
  defaultSortDirection = 1,
}) => {
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
      {tableName && <h2>{tableName}</h2>}
      {sortedArray ? (
        <StyledTable>
          <thead>
            <tr>
              {tableColumnsTemplate.map((columnTemplate, i) => {
                return (
                  columnTemplate.headingName && (
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSort(columnTemplate.keyForColumn)}
                      key={'th' + i}
                    >
                      {columnTemplate.headingName}{' '}
                      {displayArrow(columnTemplate.keyForColumn)}
                    </th>
                  )
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedArray.map((rowData, rowIndex) => {
              return (
                <tr key={'tr' + rowIndex}>
                  {tableColumnsTemplate.map((columnTemplate, columnIndex) => {
                    // optional functions to create the cell data: cellDataLink (URL format), cellDataText (a simple string), cellDataContent (when something more complex is needed). All are optional. cellDataContent has priority, if it is present.

                    const link = columnTemplate.cellDataLink
                      ? columnTemplate.cellDataLink(rowData)
                      : null;

                    const text = columnTemplate.cellDataText
                      ? columnTemplate.cellDataText(rowData)
                      : null;

                    const content = columnTemplate.cellDataContent ? (
                      columnTemplate.cellDataContent(rowData)
                    ) : link ? (
                      <Link to={link}>{text}</Link>
                    ) : (
                      text
                    );

                    return (
                      columnTemplate.headingName && (
                        <td key={'tr' + rowIndex + 'td' + columnIndex}>
                          {content}
                        </td>
                      )
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      ) : (
        <p>...</p>
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
