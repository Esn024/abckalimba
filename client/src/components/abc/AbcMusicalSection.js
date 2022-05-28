import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import abcjs from 'abcjs';
import { AppContext } from '../AppContext';
import AbcSetNumberOfMeasuresInSection from './AbcSetNumberOfMeasuresInSection.js';
import AbcNoteGrid from './AbcNoteGrid.js';

const AbcMusicalSection = ({
  letterId,
  description,
  numberOfMeasures,
  currentMusicalSectionIndex,
}) => {
  const { musicalSections, noteGridToAbc, initializeMusic } =
    useContext(AppContext);
  const [notegridVisible, setNotegridVisible] = useState(true);
  const [scoreVisible, setScoreVisible] = useState(true);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [synth, setSynth] = useState(new abcjs.synth.CreateSynth());

  const refForScoreDiv = useRef(null);
  const idForScoreDiv = 'score-' + currentMusicalSectionIndex;

  const currentMusicalSection = musicalSections[currentMusicalSectionIndex];
  const currentNoteGrid = currentMusicalSection.measures;

  // create synth
  useEffect(() => {
    // renderAbc or renderMidi
    // currentMusicalSection &&
    // try {
    // setSynth(new abcjs.synth.CreateSynth());
    // } catch (error) {
    //   console.log('Creating synth failed', error);
    // }

    // if (synth) {
    const abc = noteGridToAbc(currentNoteGrid);
    const abc2 = 'abcde';
    const abc3 = `X:1
M:4/8
Q:1/8=180
L:1/8
%%score (H1 H2)
V:H1           clef=treble  name="Hand 1"  snm="1"
V:H2           clef=treble  name="Hand 2"  snm="2"
K:Am
% 1
[V:H1]  zbzc | zzbz | 
[V:H2]  zzzb | bzzb |`;
    initializeMusic(abc, idForScoreDiv, synth);
    console.log(abc);
    // }
  }, [scoreVisible]);

  // useEffect(() => {
  //   const abc = noteGridToAbc(currentNoteGrid);
  //   const loadMusic = async () => {
  //     userLoadMusic(abc, idForScoreDiv, synth);
  //   };
  //   loadMusic();
  // }, [currentNoteGrid, idForScoreDiv, synth]);

  return (
    <Wrapper id={`section-${letterId}`}>
      <Text>Section {letterId}</Text>
      <StyledButton onClick={() => noteGridToAbc(currentNoteGrid)}>
        note grid to Abc
      </StyledButton>
      <HorizontalWrapper>
        <PlaybackButton
          onClick={() => {
            setMusicIsPlaying(!musicIsPlaying);
            // console.log({ musicIsPlaying });
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
      </HorizontalWrapper>
      <HorizontalWrapper>
        <StyledButton onClick={() => setNotegridVisible(!notegridVisible)}>
          {notegridVisible ? 'Hide grid' : 'Show grid'}
        </StyledButton>
        <StyledButton onClick={() => setScoreVisible(!scoreVisible)}>
          {scoreVisible ? 'Hide score' : 'Show score'}
        </StyledButton>
      </HorizontalWrapper>
      {scoreVisible && <div id={idForScoreDiv} ref={refForScoreDiv}></div>}
      {notegridVisible && (
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

const HorizontalWrapper = styled.div`
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
