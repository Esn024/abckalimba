import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import useToneRows from '../hooks/use-tone-rows.hook.js';
import useArrayOfObjectsSortedByField from '../hooks/use-array-of-objects-sorted-by-field.hook.js';

import { AppContext } from './AppContext';

import SortableTable from './SortableTable';

const ToneRows = () => {
  const { dateFromMs } = useContext(AppContext);
  const [toneRows, setToneRows] = useToneRows();

  return (
    <SortableTable
      tableName={'Tone Rows'}
      objArr={toneRows}
      tableColumnsTemplate={[
        {
          keyForColumn: 'toneRowStr',
          headingName: 'Tone Row',
          cellDataText(t) {
            return t.toneRowStr;
          },
          // TODO create ToneRow component
          // cellDataLink(t) {
          //   return `/tonerows/${t.toneRowId}`;
          // },
        },
        {
          keyForColumn: 'projectIds',
          headingName: 'Projects',
          cellDataContent(t) {
            return t.projectIds.map((id, index) => {
              return (
                <span key={index}>
                  <Link to={`/projects/${id}`}>{id}</Link>{' '}
                </span>
              );
            });
          },
        },
      ]}
      defaultKeyToSortBy={'toneRowStr'}
    />
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
