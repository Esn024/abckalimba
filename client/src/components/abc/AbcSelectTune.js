import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSelectTune = () => {
  return (
    <>
      <StyledLabel htmlFor='select-abc-tune'>
        <Text>Select ABC tune:</Text>
        <select
          id='select-abc-tune'
          onChange='loadNewTune(allAbcTunes[this.value])'
        >
          <option value='abc' selected>
            abc
          </option>
          <option value='abc2'>abc2</option>
          <option value='abc3'>abc3</option>
          <option value='abc4'>abc4</option>
        </select>
      </StyledLabel>
    </>
  );
};

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSelectTune;
