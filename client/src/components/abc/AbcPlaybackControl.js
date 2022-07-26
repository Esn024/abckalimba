import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcPlaybackControl = ({
  currentMusicalSectionIndex = 'final',
  synth,
  timingCallbacks,
  musicIsPlaying,
  setMusicIsPlaying,
  sliderPosition,
  setSliderPosition,
}) => {
  const { resetPlayback, goToSpecificPlaceInSong, startPause } =
    useContext(AppContext);

  // loop music
  useEffect(() => {
    if (sliderPosition === 100) {
      //reset
      const loop = async () => {
        resetPlayback(
          synth,
          timingCallbacks,
          setMusicIsPlaying,
          setSliderPosition,
          currentMusicalSectionIndex
        );
        synth.start();
        timingCallbacks.start();
        setMusicIsPlaying(true);
      };
      loop();
    }
  }, [sliderPosition]);

  return (
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
            setSliderPosition,
            currentMusicalSectionIndex
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
  );
};

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

export default AbcPlaybackControl;
