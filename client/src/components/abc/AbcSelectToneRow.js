import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSelectToneRow = () => {
  const { tines, setTines, toneRowStrings, setToneRowStrings } =
    useContext(AppContext);
  const [toneRowStr, setToneRowStr] = useState('');

  return (
    <>
      <datalist id='tonerows'>
        {toneRowStrings.map((str) => (
          <option value={str}>{str}</option>
        ))}
      </datalist>
      <StyledInput
        placeholder='...or type in here to select from an existing tone row'
        list='tonerows'
        type='text'
        id='tonerow'
        value={toneRowStr}
        onChange={(e) => {
          const newToneRowStr = e.target.value;
          setToneRowStr(newToneRowStr);
        }}
      />
    </>
  );
};

const StyledInput = styled.input`
  width: 400px;
  margin-top: 5px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSelectToneRow;
