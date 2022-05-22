import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetBeatsPerMeasure = () => {
  const { beatsPerMeasure, setBeatsPerMeasure } = useContext(AppContext);
  return (
    <>
      <StyledLabel>
        <Text>Select Beats Per Measure:</Text>
        <StyledInput
          type='number'
          id='quantity'
          name='quantity'
          min='2'
          max='13'
          value={beatsPerMeasure}
          onChange={(e) => setBeatsPerMeasure(e.target.value)}
        />
      </StyledLabel>
    </>
  );
};

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 50px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSetBeatsPerMeasure;
