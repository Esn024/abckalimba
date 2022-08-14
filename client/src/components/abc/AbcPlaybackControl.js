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
  const {
    resetPlayback,
    goToSpecificPlaceInSong,
    startPause,
    musicInitialized,
  } = useContext(AppContext);

  // loop music
  useEffect(() => {
    if (sliderPosition === 100) {
      //reset
      const loop = async () => {
        await resetPlayback(
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
      {musicInitialized ? (
        <>
          <PlaybackButton
            onClick={async () => {
              //setMusicIsPlaying(!musicIsPlaying);
              // console.log({ musicIsPlaying });
              // console.log({ musicInitialized });
              if (!musicInitialized) {
                await resetPlayback(
                  synth,
                  timingCallbacks,
                  setMusicIsPlaying,
                  setSliderPosition,
                  currentMusicalSectionIndex
                );

                // setTimeout(() => {
                //   console.log({ musicInitialized });
                //   console.log({ timingCallbacks });
                //   startPause(
                //     synth,
                //     timingCallbacks,
                //     musicIsPlaying,
                //     setMusicIsPlaying,
                //     sliderPosition
                //   );
                // }, '1500');
              } else {
                // console.log('between reset and startpause');
                startPause(
                  synth,
                  timingCallbacks,
                  musicIsPlaying,
                  setMusicIsPlaying,
                  sliderPosition
                );
              }
            }}
          >
            {musicIsPlaying ? (
              <img
                src={require('../../assets/pause.svg').default}
                alt='Pause'
                height='12px'
                width='8px'
              />
            ) : (
              <img
                src={require('../../assets/play.svg').default}
                alt='Play'
                height='16px'
                width='8px'
              />
            )}
          </PlaybackButton>

          <PlaybackButton
            onClick={async () =>
              await resetPlayback(
                synth,
                timingCallbacks,
                setMusicIsPlaying,
                setSliderPosition,
                currentMusicalSectionIndex
              )
            }
          >
            <img
              src={require('../../assets/stop.svg').default}
              alt='Stop'
              height='16px'
              width='8px'
            />
          </PlaybackButton>
        </>
      ) : (
        <PlaybackButton2
          onClick={async () =>
            await resetPlayback(
              synth,
              timingCallbacks,
              setMusicIsPlaying,
              setSliderPosition,
              currentMusicalSectionIndex
            )
          }
        >
          Play
        </PlaybackButton2>
      )}
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

const PlaybackButton2 = styled(StyledButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 22px;
`;

export default AbcPlaybackControl;
