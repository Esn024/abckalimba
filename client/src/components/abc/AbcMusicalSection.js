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
  } = useContext(AppContext);
  const [notegridVisible, setNotegridVisible] = useState(true);
  const [scoreVisible, setScoreVisible] = useState(true);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  //TODO move into object so it can be passed be reference? Or else, just pass the ID into the beatCallback, and the ID never changes...
  const [sliderPosition, setSliderPosition] = useState(0);
  const [synth, setSynth] = useState(new abcjs.synth.CreateSynth());
  // const [visualObj, setVisualObj] = useState();
  const [lastEls, setLastEls] = useState([]);
  const [timingCallbacks, setTimingCallbacks] = useState();
  const [allNoteEvents, setAllNoteEvents] = useState([]);

  const refForScoreDiv = useRef(null);
  const idForScoreDiv = 'score-' + currentMusicalSectionIndex;

  const currentMusicalSection = musicalSections[currentMusicalSectionIndex];
  const currentNoteGrid = currentMusicalSection.measures;

  // I would have liked to move the big callback functions below (eventCallback, sequenceCallback and beatCallback) into the AppContext, to improve organization and reduce duplication, but this was unfortunately not possible because they modify certain local states within this function component which it was not possible to lift (because they are different for every musical section), and neither was it possible to pass in the setter functions (e.g. setLastEls) as function parameters into them, because in ABCJS the parameters that can be passed into these callbacks are already pre-defined.

  // the function to change colours to red
  const eventCallback = (ev) => {
    if (!ev) {
      setMusicIsPlaying(!musicIsPlaying);
      return;
    }

    colorElements(ev.elements, lastEls, setLastEls);
  };

  // the function for changing events in audio playback. Runs once after the array of notes is created, but just before it is used to create the audio buffer
  const sequenceCallback = (tracks) => {
    // time signature can be anywhere from 2/8 to 13/8. Find the # of eighth notes (beats) per measure
    //const regexForTimeSignature = /M:\s?([2-9]|1[0-3])\/8/;
    //const beatsPerMeasure = currentTune.match(regexForTimeSignature)[1];

    // console.log({beatsPerMeasure});
    // console.log(tracks);

    let newAllNoteEvents = [];

    tracks.forEach((track, trackIndex) => {
      track.forEach((event) => {
        //which measure this event is in
        const measure = Math.floor(event.start);

        console.log({ beatsPerMeasure });

        //calculate which overall beat this event falls on, based on how many beats there are in each measure
        const beatFromStart = event.start * beatsPerMeasure;

        // calculate which beat this is within the current measure
        const beatInMeasure = (event.start - measure) * beatsPerMeasure;

        // MIDI (scientific notation) note name
        const midiNoteName = midiNumberToMidiNoteName(event.pitch);

        // ABC notation note name
        const abcNoteName = midiNoteNameToAbc(midiNoteName);

        // apply any tuning modifications set by the user
        tines.forEach((tine) => {
          if (abcNoteName === tine.abcNote) {
            event.cents = tine.cents;
          }
        });

        // make an array of all note events. Also add a new beat property to each one
        newAllNoteEvents.push({
          ...event,
          measure,
          beatFromStart,
          beatInMeasure,
          midiNoteName,
          abcNoteName,
        });
      });
    });

    setAllNoteEvents(newAllNoteEvents);
    console.log({ newAllNoteEvents });
  };

  // this runs every beat
  const beatCallback = async (beatNumber, totalBeats) => {
    //console.log(beatNumber);

    // array of MIDI pitches currently playing (e.g. [60, 62])
    const currentPitches = allNoteEvents
      .filter((e) => e.beatFromStartOfSong === beatNumber)
      .map((e) => e.pitch);
    // since I've added an abcNoteName to each event, I can also get the abcPitches
    const currentAbcPitches = allNoteEvents
      .filter((e) => e.beatFromStartOfSong === beatNumber)
      .map((e) => e.abcNoteName);

    console.log({ allNoteEvents });
    // console.log({ currentPitches });
    // console.log({ currentAbcPitches });

    // move the position of the audio slider
    setSliderPosition((beatNumber / totalBeats) * 100);
    //if tune has ended
    if (beatNumber == totalBeats) {
      //console.log("piece is over");

      //reset
      await resetPlayback(
        synth,
        timingCallbacks,
        setMusicIsPlaying,
        setSliderPosition
      );
      //and start again (in effect, loop)
      await synth.start(0);
      timingCallbacks.start(0);
    }
  };

  // initialize music
  useEffect(() => {
    const abc = noteGridToAbc(currentNoteGrid, tempo, key);

    const visualObj = abcjs.renderAbc(idForScoreDiv, abc, {
      responsive: 'resize',
      add_classes: true,
    })[0];

    setTimingCallbacks(
      new abcjs.TimingCallbacks(visualObj, {
        eventCallback: eventCallback,
        beatCallback: beatCallback,
      })
    );

    initializeMusic(visualObj, synth, sequenceCallback);
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
