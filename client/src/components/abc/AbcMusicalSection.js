import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import abcjs from 'abcjs';
import { AppContext } from '../AppContext';
import AbcSetNumberOfMeasuresInSection from './AbcSetNumberOfMeasuresInSection.js';
import AbcNoteGrid from './AbcNoteGrid.js';
import AbcPlaybackControl from './AbcPlaybackControl.js';
// import useForceUpdate from '../../hooks/use-force-update.hook.js';

const AbcMusicalSection = ({
  letterId,
  description,
  numberOfMeasures,
  currentMusicalSectionIndex,
}) => {
  const {
    hideAllSections,
    hideAllGrids,
    hideAllScores,
    beatsPerMeasure,
    musicalSections,
    updateDescriptionOfMusicalSection,
    noteGridToAbc,
    singleMusicalSectionToAbc,
    initializeMusic,
    tempo,
    key,
    colorElements,
    tines,
    getEventCallback,
    getBeatCallback,
    getSequenceCallback,
    project,
    audioContext,
    musicInitialized,
    setMusicInitialized,
  } = useContext(AppContext);
  const [notegridVisible, setNotegridVisible] = useState(!hideAllGrids);
  const [scoreVisible, setScoreVisible] = useState(!hideAllScores);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  //TODO move into object so it can be passed be reference? Or else, just pass the ID into the beatCallback, and the ID never changes...
  const [sliderPosition, setSliderPosition] = useState(0);
  const [synth, setSynth] = useState(new abcjs.synth.CreateSynth());
  // const [visualObj, setVisualObj] = useState();
  const [timingCallbacks, setTimingCallbacks] = useState();
  const [allNoteEvents, setAllNoteEvents] = useState([]);

  const refForScoreDiv = useRef(null);
  const idForScoreDiv = 'score-' + currentMusicalSectionIndex;

  // console.log({ tines });
  // initialize music
  useEffect(() => {
    // console.log('tonerowStr', objToToneRowStr(tines));

    const currentMusicalSection = musicalSections[currentMusicalSectionIndex];
    const abc = singleMusicalSectionToAbc(
      currentMusicalSection,
      noteGridToAbc,
      tempo,
      key
    );

    // console.log({ idForScoreDiv, abc });

    const visualObj = abcjs.renderAbc(idForScoreDiv, abc, {
      responsive: 'resize',
      add_classes: true,
    })[0];

    // console.log({ visualObj });

    async function musicAndTiming() {
      console.log('musicAndTiming');
      // if (audioContext.state !== 'running') await audioContext.resume();

      await initializeMusic(
        visualObj,
        synth,
        getSequenceCallback(setAllNoteEvents, currentMusicalSection)
      );

      if (!musicInitialized) setMusicInitialized(true);
      console.log('music initialized');

      const newTimingCallbacks = new abcjs.TimingCallbacks(visualObj, {
        eventCallback: getEventCallback(
          colorElements,
          musicIsPlaying,
          setMusicIsPlaying,
          abc,
          currentMusicalSectionIndex
        ),
        beatCallback: getBeatCallback(setSliderPosition),
      });

      // console.log({ newTimingCallbacks });

      setTimingCallbacks(newTimingCallbacks);
    }
    musicAndTiming();
  }, [tempo, key, musicalSections, tines, project]);

  //visibility of notegrid
  useEffect(() => {
    setNotegridVisible(!hideAllGrids);
  }, [hideAllGrids]);

  //visibility of score
  useEffect(() => {
    setScoreVisible(!hideAllScores);
  }, [hideAllScores]);

  // console.log({ description });
  return (
    <Wrapper
      id={`section-${letterId}`}
      style={{ display: hideAllSections ? 'none' : 'flex' }}
    >
      <HorizontalWrapper>
        <Text>Section {letterId}</Text>
        <StyledInput
          placeholder='(optional notes)'
          value={description ? description : ''}
          onChange={(e) => {
            //update description
            const newDescription = e.target.value;
            updateDescriptionOfMusicalSection(
              currentMusicalSectionIndex,
              newDescription
            );
          }}
        />
      </HorizontalWrapper>
      <AbcPlaybackControl
        currentMusicalSectionIndex={currentMusicalSectionIndex}
        synth={synth}
        timingCallbacks={timingCallbacks}
        musicIsPlaying={musicIsPlaying}
        setMusicIsPlaying={setMusicIsPlaying}
        sliderPosition={sliderPosition}
        setSliderPosition={setSliderPosition}
      />
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
  border: rgb(150, 52, 102, 1) solid 2px;
  margin: 0 0 10px;
  padding: 20px;
  border-radius: 10px;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button`
  font-size: var(--font-size-smaller);
`;

const PlaybackButton = styled(StyledButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
`;

const StyledInput = styled.input`
  font-size: var(--font-size-smaller);
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
