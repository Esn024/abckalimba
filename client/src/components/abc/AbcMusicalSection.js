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
  const {
    beatsPerMeasure,
    musicalSections,
    noteGridToAbc,
    initializeMusic,
    tempo,
    key,
    colorElements,
    midiNumberToMidiNoteName,
    midiNoteNameToAbc,
    tines,
    resetPlayback,
    goToSpecificPlaceInSong,
    startPause,
    getEventCallback,
    getBeatCallback,
    getSequenceCallback,
  } = useContext(AppContext);
  const [notegridVisible, setNotegridVisible] = useState(true);
  const [scoreVisible, setScoreVisible] = useState(true);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  //TODO move into object so it can be passed be reference? Or else, just pass the ID into the beatCallback, and the ID never changes...
  const [sliderPosition, setSliderPosition] = useState(0);
  const [synth, setSynth] = useState(new abcjs.synth.CreateSynth());
  // const [visualObj, setVisualObj] = useState();
  const [timingCallbacks, setTimingCallbacks] = useState();
  const [allNoteEvents, setAllNoteEvents] = useState([]);

  const refForScoreDiv = useRef(null);
  const idForScoreDiv = 'score-' + currentMusicalSectionIndex;

  const currentMusicalSection = musicalSections[currentMusicalSectionIndex];
  const currentNoteGrid = currentMusicalSection.measures;

  // initialize music
  useEffect(() => {
    const abc = noteGridToAbc(currentNoteGrid, tempo, key);

    const visualObj = abcjs.renderAbc(idForScoreDiv, abc, {
      responsive: 'resize',
      add_classes: true,
    })[0];

    setTimingCallbacks(
      new abcjs.TimingCallbacks(visualObj, {
        eventCallback: getEventCallback(
          colorElements,
          musicIsPlaying,
          setMusicIsPlaying
        ),
        beatCallback: getBeatCallback(
          allNoteEvents,
          resetPlayback,
          synth,
          timingCallbacks,
          setMusicIsPlaying,
          setSliderPosition
        ),
      })
    );

    initializeMusic(visualObj, synth, getSequenceCallback(setAllNoteEvents));
  }, [tempo, key, musicalSections]);

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
      <StyledButton onClick={() => noteGridToAbc(currentNoteGrid, tempo, key)}>
        note grid to Abc
      </StyledButton>
      <HorizontalWrapper>
        <PlaybackButton
          onClick={() => {
            //setMusicIsPlaying(!musicIsPlaying);
            // console.log({ musicIsPlaying });
            startPause(
              synth,
              timingCallbacks,
              musicIsPlaying,
              setMusicIsPlaying,
              sliderPosition
            );
          }}
        >
          {musicIsPlaying ? '⏸' : '▶'}
        </PlaybackButton>
        <PlaybackButton
          onClick={() =>
            resetPlayback(
              synth,
              timingCallbacks,
              setMusicIsPlaying,
              setSliderPosition
            )
          }
        >
          ⏹
        </PlaybackButton>
        <input
          type='range'
          min='0'
          max='100'
          value={sliderPosition}
          id={'slider-' + currentMusicalSectionIndex}
          onChange={(ev) => {
            const newSliderPosition = ev.target.value;
            setSliderPosition(newSliderPosition);
            goToSpecificPlaceInSong(
              newSliderPosition / 100,
              synth,
              timingCallbacks
            );
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
      {
        <div
          id={idForScoreDiv}
          ref={refForScoreDiv}
          style={{ display: scoreVisible ? 'block' : 'none' }}
        ></div>
      }
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
