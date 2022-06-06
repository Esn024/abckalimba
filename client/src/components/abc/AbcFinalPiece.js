import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import abcjs from 'abcjs';
import { AppContext } from '../AppContext';
import AbcSetNumberOfMeasuresInSection from './AbcSetNumberOfMeasuresInSection.js';
import AbcNoteGrid from './AbcNoteGrid.js';
import AbcPlaybackControl from './AbcPlaybackControl.js';
import AbcSetOrderOfSections from './AbcSetOrderOfSections.js';

import AbcSetProjectName from './AbcSetProjectName.js';
//

const AbcFinalPiece = () => {
  const {
    tines,
    orderOfSections,
    beatsPerMeasure,
    musicalSections,
    musicalSectionsToAbc,
    projectName,
    setProjectName,
    noteGridToAbc,
    initializeMusic,
    tempo,
    key,
    colorElements,
    getEventCallback,
    getBeatCallback,
    getSequenceCallback,
  } = useContext(AppContext);

  const [scoreVisible, setScoreVisible] = useState(true);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [synth, setSynth] = useState(new abcjs.synth.CreateSynth());
  const [timingCallbacks, setTimingCallbacks] = useState();
  const [allNoteEvents, setAllNoteEvents] = useState([]);

  const refForScoreDiv = useRef(null);
  const idForScoreDiv = 'final-score';

  // initialize music
  useEffect(() => {
    const abc = musicalSectionsToAbc(
      musicalSections,
      orderOfSections,
      noteGridToAbc,
      tempo,
      key,
      projectName
    );

    const visualObj = abcjs.renderAbc(idForScoreDiv, abc, {
      responsive: 'resize',
      add_classes: true,
    })[0];

    initializeMusic(visualObj, synth, getSequenceCallback(setAllNoteEvents));

    setTimingCallbacks(
      new abcjs.TimingCallbacks(visualObj, {
        eventCallback: getEventCallback(
          colorElements,
          musicIsPlaying,
          setMusicIsPlaying
        ),
        //TODO the allNoteEvents array that gets sent here is one state update behind
        beatCallback: getBeatCallback(allNoteEvents, setSliderPosition),
      })
    );
  }, [tempo, key, musicalSections, orderOfSections, tines, projectName]);

  return (
    <Wrapper id='final-music-wrapper'>
      <Text>Final Music</Text>

      <AbcSetOrderOfSections />
      <AbcPlaybackControl
        currentMusicalSectionIndex={null}
        synth={synth}
        timingCallbacks={timingCallbacks}
        musicIsPlaying={musicIsPlaying}
        setMusicIsPlaying={setMusicIsPlaying}
        sliderPosition={sliderPosition}
        setSliderPosition={setSliderPosition}
      />
      <StyledButton onClick={() => setScoreVisible(!scoreVisible)}>
        {scoreVisible ? 'Hide score' : 'Show score'}
      </StyledButton>
      {
        <div
          id={idForScoreDiv}
          ref={refForScoreDiv}
          style={{ display: scoreVisible ? 'block' : 'none' }}
        ></div>
      }
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

export default AbcFinalPiece;
