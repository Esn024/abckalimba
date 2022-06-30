import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import useToneRows from '../hooks/use-tone-rows.hook.js';

import { AppContext } from './AppContext';

import SortableTable from './SortableTable';

const ToneRows = () => {
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

const Link = styled(NavLink)`
  text-decoration: none;
  color: var(--color-alabama-crimson);
`;

export default ToneRows;
