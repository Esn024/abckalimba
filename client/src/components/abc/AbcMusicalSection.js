import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';
import AbcSetNumberOfMeasuresInSection from './AbcSetNumberOfMeasuresInSection.js';

const AbcMusicalSection = ({ letterId }) => {
  const { numberOfMeasures, setNumberOfMeasures } = useState(1);
  // const { thumbOneOrTwo, setThumbOneOrTwo } = useContext(AppContext);
  return (
    <Wrapper>
      <AbcSetNumberOfMeasuresInSection
        id={`section-${letterId}`}
        numberOfMeasures={numberOfMeasures}
        setNumberOfMeasures={setNumberOfMeasures}
      />
      <Text>Section:</Text>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: var(--font-size-small);
`;

const StyledLabel = styled.label`
  font-size: var(--font-size-small);
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcMusicalSection;
