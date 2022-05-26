import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';
import AbcSetNumberOfMeasuresInSection from './AbcSetNumberOfMeasuresInSection.js';
import AbcNoteGrid from './AbcNoteGrid.js';

const AbcMusicalSection = ({
  letterId,
  description,
  numberOfMeasures,
  currentMusicalSectionIndex,
}) => {
  // const { thumbOneOrTwo, setThumbOneOrTwo } = useContext(AppContext);
  return (
    <Wrapper id={`section-${letterId}`}>
      <AbcSetNumberOfMeasuresInSection
        numberOfMeasures={numberOfMeasures}
        currentMusicalSectionIndex={currentMusicalSectionIndex}
      />
      <Text>Section {letterId}:</Text>
      <AbcNoteGrid currentMusicalSectionIndex={currentMusicalSectionIndex} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
