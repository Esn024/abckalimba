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
  const { musicalSections, noteGridToAbc } = useContext(AppContext);
  const [visible, setVisible] = useState(1);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);

  const currentNoteGrid = musicalSections[currentMusicalSectionIndex].measures;

  return (
    <Wrapper id={`section-${letterId}`}>
      <Text>Section {letterId}</Text>
      <StyledButton onClick={() => noteGridToAbc(currentNoteGrid)}>
        note grid to Abc
      </StyledButton>
      <PlaybackWrapper>
        <PlaybackButton
          onClick={() => {
            setMusicIsPlaying(!musicIsPlaying);
            console.log({ musicIsPlaying });
          }}
        >
          {musicIsPlaying ? '⏸' : '▶'}
        </PlaybackButton>
        <PlaybackButton>⏹</PlaybackButton>
        <input
          type='range'
          min='0'
          max='100'
          value={sliderPosition}
          id={'slider-' + currentMusicalSectionIndex}
          onChange={(ev) => {
            const newSliderPosition = ev.target.value;
            setSliderPosition(newSliderPosition);
            //goToSpecificPlaceInSong(this.value / 100)
          }}
        ></input>
      </PlaybackWrapper>
      <StyledButton onClick={() => setVisible(!visible)}>
        {visible ? 'Hide' : 'Show'}
      </StyledButton>
      {visible && (
        <>
          <AbcSetNumberOfMeasuresInSection
            numberOfMeasures={numberOfMeasures}
            currentMusicalSectionIndex={currentMusicalSectionIndex}
          />
          <AbcNoteGrid
            currentMusicalSectionIndex={currentMusicalSectionIndex}
          />
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlaybackWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button`
  font-size: 12px;
`;

const PlaybackButton = styled(StyledButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
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
