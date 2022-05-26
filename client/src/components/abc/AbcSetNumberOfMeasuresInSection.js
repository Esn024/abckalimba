import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfMeasuresInSection = ({
  numberOfMeasures,
  setNumberOfMeasures,
}) => {
  return (
    <>
      <StyledLabel>
        <Text># of Measures:</Text>
        <StyledInput
          type='number'
          min='1'
          max='100'
          value={numberOfMeasures}
          onChange={(e) => setNumberOfMeasures(e.target.value)}
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

export default AbcSetNumberOfMeasuresInSection;
