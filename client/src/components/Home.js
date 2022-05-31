import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import abcjs from 'abcjs';
// import Abcjs from 'react-abcjs';
import AbcComponent from './abc/AbcComponent1.js';
import AbcSetNumberOfTines from './abc/AbcSetNumberOfTines';
import AbcSelectToneRow from './abc/AbcSelectToneRow';
import AbcKeyDefinitions from './abc/AbcKeyDefinitions.js';

import AbcSetBeatsPerMeasure from './abc/AbcSetBeatsPerMeasure';
import AbcSetTempo from './abc/AbcSetTempo';
import AbcSetOrderOfSections from './abc/AbcSetOrderOfSections';
import AbcSetKey from './abc/AbcSetKey';
import AbcSelectTune from './abc/AbcSelectTune.js';
import AbcSelectThumb from './abc/AbcSelectThumb.js';
import AbcSetNumberOfMusicalSections from './abc/AbcSetNumberOfMusicalSections.js';
import AbcMusicalSection from './abc/AbcMusicalSection.js';

import AbcTines from './abc/AbcTines.js';
import AbcNoteGrid from './abc/AbcNoteGrid.js';
import AbcFinalPiece from './abc/AbcFinalPiece.js';

//AbcThumbOneOrTwo

import { AppContext } from './AppContext';

const Home = () => {
  const { userId, musicalSections, hideAllSections, setHideAllSections } =
    useContext(AppContext);

  return (
    <Wrapper>
      <Text>ABC Test</Text>
      <AbcSetNumberOfTines />
      <AbcSelectToneRow />
      <AbcKeyDefinitions />
      <AbcTines />
      <HorizontalWrapper>
        <AbcSetNumberOfMusicalSections />
        <AbcSetBeatsPerMeasure />
        <AbcSetTempo />
        {/* <AbcSetKey /> // TODO, no sense in adding this in until the abc notes are actually modified based on what the key is */}
      </HorizontalWrapper>
      <HorizontalWrapper>
        <AbcSelectThumb />
        <StyledButton onClick={() => setHideAllSections(!hideAllSections)}>
          {hideAllSections ? 'Unhide' : 'Hide'} all sections
        </StyledButton>
      </HorizontalWrapper>
      {musicalSections.map((section, i) => (
        <AbcMusicalSection
          key={i}
          currentMusicalSectionIndex={i}
          letterId={section.letterId}
          numberOfMeasures={section.numberOfMeasures}
        />
      ))}
      <AbcFinalPiece />
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px auto;
  height: 660px;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  text-align: center;
  margin: 12px 0 0 24px;
`;

const StyledButton = styled.button`
  font-size: var(--font-size-smaller);
  margin: 10px;
`;

export default Home;
