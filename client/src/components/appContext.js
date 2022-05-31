import React, { createContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import abcjs from 'abcjs';

export const AppContext = createContext();

// context provider
export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  // const [numberOfTines, setNumberOfTines] = useState(3);
  const [audioContext, setAudioContext] = useState(new window.AudioContext());
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [tempo, setTempo] = useState(180);
  const [key, setKey] = useState('C');
  const [orderOfSections, setOrderOfSections] = useState('AA');

  const [hideAllSections, setHideAllSections] = useState(false);
  const [tines, setTines] = useState([
    {
      keyboardLetter: 'a',
      abcNote: 'a',
      cents: 0,
    },
    {
      keyboardLetter: 'w',
      abcNote: 'b',
      cents: 0,
    },
    {
      keyboardLetter: 's',
      abcNote: 'c',
      cents: 0,
    },
    {
      keyboardLetter: 'e',
      abcNote: 'd',
      cents: 0,
    },
  ]);
  // what a click on the note-grid means. "1" is thumb one, "2" is thumb two. (if clicked again, notegrid toggles to "0" - a musical rest)
  const [thumbOneOrTwo, setThumbOneOrTwo] = useState(1);

  const [musicalSections, setMusicalSections] = useState([
    {
      letterId: 'A',
      description: 'blah blah',
      numberOfMeasures: 2,
      measures: [
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 2, 1, 0],
        ],
        [
          [0, 2, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 2, 0, 0],
        ],
      ],
    },
  ]);

  const [toneRowStrings, setToneRowStrings] = useState([
    '5 tones (c d e f g) [awsed]',
    '6 tones (c d e f g a) [awsedr]',
    '7 tones (c d e f g a b) [awsedrf]',
  ]);

  const navigate = useNavigate();

  // return human-readable date from milliseconds since 1970
  const dateFromMs = (ms) => {
    const date = new Date(ms);
    return date.toString();
  };

  //create new user
  //have this as an onsubmit on create new user form. "form" is the useRef reference to the form from which user data is being submitted
  const createNewUser = (formData) => {
    // console.log({ formData });

    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ ...formData, created: Date.now() }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const { status, message, data } = json;

        if (status == 200) {
          setUserId(data._id);
          // add it to localStorage so it persists even after browser is closed
          localStorage.setItem('userId', data._id);

          // return to homepage
          navigate('/');
        } else {
          // TODO remove console log
          console.log('There was an error', { status, message, data });
        }
      });
  };

  // handle update user (send properly-formatted PUT request to api/users/id/:id)
  const updateUser = (formData) => {
    console.log({ formData });

    fetch(`/api/users/id/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...formData, modified: Date.now() }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message, data } = json;
        // check that the request got successfully through to server
        if (status === 202) {
          // Display confirmation message that user info was updated.
          // TODO change this to something other than alert
          alert(`Successfully changed user info for ${formData.username}`);
        } else {
          // if it didn't go through, show an error.
          throw new Error({ status, message, data });
        }
      });
  };

  // handle delete user (send properly-formatted PUT request to api/users/id/:id)
  const deleteUser = (formData) => {
    fetch(`/api/users/id/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message, data } = json;
        // check that the request got successfully through to server
        if (status === 207) {
          // remove the userId from localstorage
          localStorage.removeItem('userId');
          // Display confirmation message that user info was deleted.
          // TODO change this to something other than alert
          alert(`Successfully deleted user!`);
        } else {
          // if it didn't go through, show an error.
          throw new Error({ status, message, data });
        }
      });
  };

  const permissionToEditProject = (currentUser, project) => {
    // allow only the project creator or the site Admin to edit a project
    return (
      currentUser.username === project.username ||
      currentUser.username === 'Admin'
    );
  };

  // replace one value in array, return the changed array
  const replaceOneValueInArray = (changedValue, index, originalArray) => {
    let newArray = [...originalArray]; // create copy of tines array
    newArray[index] = changedValue; //new value
    return newArray;
  };

  //find how many times index goes into number of tines
  const getRowNumFromIndex = (tines, index) => {
    Math.floor((index + 1) / tines.length);
  };

  const userPlayNote = async (abcNoteName, cents) => {
    if (abcNoteName) {
      // get the midi pitch of the abc note name
      const midiPitch = midiNoteNameToNumber(abcToMidiNoteName(abcNoteName));
      // when input a note name in abc notation, play that note

      //console.log({abcNoteName});
      const visualObj = abcjs.renderAbc('*', abcNoteName, {})[0];

      const sequenceCallbackOneNote = (tracks) => {
        tracks.forEach((track) => {
          track.forEach((event) => {
            //console.log({event});
            //console.log('event pitch', event.pitch);
            // apply any custom user tuning correction in cents
            if (event.pitch === midiPitch) {
              event.cents = cents;
              //console.log('sequenceCallback event', event);
            }
          });
        });
      };

      try {
        const synth = new abcjs.synth.CreateSynth();

        //should the below line be here?
        await audioContext.resume();
        // In theory the AC shouldn't start suspended because it is being initialized in a click handler, but iOS seems to anyway.

        await synth.init({
          audioContext: audioContext,
          visualObj: visualObj,
          options: {
            sequenceCallback: sequenceCallbackOneNote,
            soundFontUrl: 'soundfonts',
            onEnded: () => {
              //console.log("playback ended")
            },
          },
        });

        await synth.prime();
        synth.start();

        //console.log("note played");
      } catch (error) {
        console.log('error playing note', error);
      }
    }
  };

  const changeOneNote = (
    musicalSectionIndex,
    measureIndex,
    beatIndex,
    noteIndex,
    note,
    thumbOneOrTwo
  ) => {
    let modifiedMusicalSections = [...musicalSections];

    modifiedMusicalSections[musicalSectionIndex].measures[measureIndex][
      beatIndex
    ][noteIndex] = note > 0 ? 0 : thumbOneOrTwo;
    setMusicalSections(modifiedMusicalSections);
  };

  //helper functions

  //helper function. Convert a scientific notation (midi note name) to ABC notation.
  const midiNoteNameToAbc = (midiNoteName) => {
    let abcNoteName = '';
    let noteName = midiNoteName.match(/([A-G])/)[1];
    let octave = midiNoteName.match(/([0-8])/)[1];
    let flat = midiNoteName.includes('b');
    //for now, it doesn't output sharps, only flat notes
    if (flat) abcNoteName += '_';
    if (octave >= 5) noteName = noteName.toLowerCase();
    abcNoteName += noteName;
    if (octave == 0) abcNoteName += ',,,,';
    if (octave == 1) abcNoteName += ',,,';
    if (octave == 2) abcNoteName += ',,';
    if (octave == 3) abcNoteName += ',';
    if (octave == 6) abcNoteName += "'";
    if (octave == 7) abcNoteName += "''";
    if (octave == 8) abcNoteName += "'''";
    //examples:
    //C3 = C,
    //C4 = C
    //C5 = c
    //C6 = c'
    return abcNoteName;
  };

  //helper function. Convert an ABC note name to scientific notation (midi note name).
  const abcToMidiNoteName = (abcNoteName) => {
    // if (abcNoteName) {
    let midiNoteName = '';
    let noteName = abcNoteName.match(/([a-gA-G])/)[1].toUpperCase();
    // console.log({ abcNoteName });
    // console.log({ noteName });
    let flat = abcNoteName.includes('_');
    let sharp = abcNoteName.includes('^');
    midiNoteName = noteName;
    // for now, the return is always flat notes
    if (flat) midiNoteName += 'b';
    if (sharp) {
      if (noteName === 'A') {
        midiNoteName = 'Bb';
      } else if (noteName === 'B') {
        midiNoteName = 'C';
      } else if (noteName === 'C') {
        midiNoteName = 'Db';
      } else if (noteName === 'D') {
        midiNoteName = 'Eb';
      } else if (noteName === 'E') {
        midiNoteName = 'F';
      } else if (noteName === 'F') {
        midiNoteName = 'Gb';
      } else if (noteName === 'G') {
        midiNoteName = 'Ab';
      }
    }
    // figure out the octave
    let octave = abcNoteName.includes(',,,,')
      ? '0'
      : abcNoteName.includes(',,,')
      ? '1'
      : abcNoteName.includes(',,')
      ? '2'
      : abcNoteName.includes(',')
      ? '3'
      : abcNoteName.includes("'''")
      ? '8'
      : abcNoteName.includes("''")
      ? '7'
      : abcNoteName.includes("'")
      ? '6'
      : abcNoteName.match(/([a-g])/)
      ? '5'
      : '4';
    // console.log({ octave });
    midiNoteName += octave;
    //examples:
    // C, = C3
    // C = C4
    // c = C5
    // c' = C6
    // console.log({ midiNoteName });
    return midiNoteName;
    // }
  };

  //helper function. Convert scientific notation (midi note name) to midi number.
  const midiNoteNameToNumber = (midiNoteName) => {
    let noteName = midiNoteName.match(/([A-G])/)[1];
    let octave = midiNoteName.match(/([0-8])/)[1];
    let flat = midiNoteName.includes('b');
    // first get the midiNumber as if octave was "0"
    let midiNumber =
      noteName === 'C'
        ? 12
        : noteName === 'D'
        ? 14
        : noteName === 'E'
        ? 16
        : noteName === 'F'
        ? 17
        : noteName === 'G'
        ? 19
        : noteName === 'A'
        ? 21
        : noteName === 'B'
        ? 23
        : null;
    // check if there's a flat
    if (flat) midiNumber--;
    //now return the right midiNumber for the octave
    return midiNumber + 12 * parseInt(octave);
  };

  //helper function. Convert midi number to scientific notation (midi note name). This uses abcjs's built-in converter
  const midiNumberToMidiNoteName = (midiNumber) => {
    return abcjs.synth.pitchToNoteName[midiNumber];
  };

  // function and variable to do with adding & removing the CSS that gives red color to elements that are "playing"
  const colorElements = (currentEls) => {
    // check if there is a new note, or if there are only rests
    let newNote = false;
    currentEls.forEach((el) => {
      if (el[0].classList.contains('abcjs-note')) {
        newNote = true;
      }
    });
    //if there is a new note, remove any previous red color, otherwise keep it until a new note shows up
    if (newNote) {
      // remove any earlier red coloration
      Array.from(document.querySelectorAll('.color')).forEach((el) =>
        el.classList.remove('color')
      );
    }

    //currentEls.forEach((currentEl) => {});
    for (let i = 0; i < currentEls.length; i++) {
      //console.log('currentEls[i]', currentEls[i]);
      for (let j = 0; j < currentEls[i].length; j++) {
        //console.log('currentEls[i][j]', currentEls[i][j]);
        currentEls[i][j].classList.add('color');
      }
    }
  };

  // convert measures stored in the format of a note grid array into abc notation (returns a 2-item array of abc for the left and right hand)
  const noteGridToAbc = (measures) => {
    let handOneAbcNotesThisBeat = [];
    let handTwoAbcNotesThisBeat = [];

    let handOneAbc = '';
    let handTwoAbc = '';

    measures.forEach((measure) => {
      measure.forEach((beat) => {
        beat.forEach((note, index) => {
          // TODO modify the abc note based on the key
          if (note === 1) {
            handOneAbcNotesThisBeat.push(tines[index].abcNote);
          } else if (note === 2) {
            handTwoAbcNotesThisBeat.push(tines[index].abcNote);
          }
        });

        //hand one (up-facing stems)
        if (handOneAbcNotesThisBeat.length === 0) {
          handOneAbc += 'z'; // rest (no notes)
        } else if (handOneAbcNotesThisBeat.length === 1) {
          // if just one note per beat
          handOneAbc += handOneAbcNotesThisBeat[0];
        } else {
          // if there are multiple notes per beat, they should be combined in square brackets, e.g. "[ceg]"
          handOneAbc += '[';
          handOneAbcNotesThisBeat.forEach((n) => (handOneAbc += n));
          handOneAbc += ']';
        }

        //hand two (down-facing stems)
        if (handTwoAbcNotesThisBeat.length === 0) {
          handTwoAbc += 'z'; // rest (no notes)
        } else if (handTwoAbcNotesThisBeat.length === 1) {
          // if just one note per beat
          handTwoAbc += handTwoAbcNotesThisBeat[0];
        } else {
          // if there are multiple notes per beat, they should be combined in square brackets, e.g. "[ceg]"
          handTwoAbc += '[';
          handTwoAbcNotesThisBeat.forEach((n) => (handTwoAbc += n));
          handTwoAbc += ']';
        }

        // reset arrays
        handOneAbcNotesThisBeat = [];
        handTwoAbcNotesThisBeat = [];
      });

      // add bar-lines at the end of each bar/measure in ABC string
      handOneAbc += ' | ';
      handTwoAbc += ' | ';
    });

    // console.log(abc);
    return [handOneAbc, handTwoAbc];
  };

  //convert ONE musical section to abc, properly formatted
  const singleMusicalSectionToAbc = (
    currentMusicalSection,
    noteGridToAbc,
    tempo = 180,
    key = 'C'
  ) => {
    const { letterId, description, measures, numberOfMeasures } =
      currentMusicalSection;
    const [handOneAbc, handTwoAbc] = noteGridToAbc(measures);

    // TODO may need to update the below line later in case this number will be able to change mid-piece
    const beatsPerBar = measures[0].length;

    // replace all spaces in description with tildes so that it displays under the notes like lyrics, but free of beat divisions
    const modifiedDescription = description.replace(/\s/g, '~');

    const abc = `X:1
M:${beatsPerBar}/8
Q:1/8=${tempo}
L:1/8
%%score (H1 H2)
V:H1           clef=treble  name="Hand 1"  snm="1"
V:H2           clef=treble  name="Hand 2"  snm="2"
K:${key}
% 1
[P:${letterId}] [V:H1] ${handOneAbc}
w:${modifiedDescription}
[V:H2] ${handTwoAbc}`;

    // console.log(abc);
    return abc;
  };

  //convert all the musical sections to ABC that are specified as being included in the final piece in the "orderOfSections" string, and place them in the correct order
  const musicalSectionsToAbc = (
    musicalSections,
    orderOfSections,
    noteGridToAbc,
    tempo = 180,
    key = 'C'
  ) => {
    // TODO may need to update the below line later in case this number will be able to change mid-piece
    const beatsPerBar = musicalSections[0].measures[0].length;

    //TODO this currently assumes that musicalSections have no numbers in them, are a simple format like ABAC
    const musicalSectionsArr = orderOfSections.split('');

    let abc = `X:1
M:${beatsPerBar}/8
P:${orderOfSections}
Q:1/8=${tempo}
L:1/8
%%score (H1 H2)
V:H1           clef=treble  name="Hand 1"  snm="1"
V:H2           clef=treble  name="Hand 2"  snm="2"
K:${key}`;

    //TODO put musical sections in the correct order
    musicalSectionsArr.forEach((letterId) => {
      const currentMusicalSection = musicalSections.find(
        (s) => s.letterId === letterId
      );

      if (currentMusicalSection) {
        const { description, measures, numberOfMeasures } =
          currentMusicalSection;
        const [handOneAbc, handTwoAbc] = noteGridToAbc(measures);

        // replace all spaces in description with tildes so that it displays under the notes like lyrics, but free of beat divisions
        // also add ' | ' string at the end times however many measures there are, so that the next description is aligned with the correct measure
        const modifiedDescription =
          description.replace(/\s/g, '~') + ' | '.repeat(measures.length);

        abc += `
[P:${letterId}] [V:H1] ${handOneAbc}
w:${modifiedDescription}
[V:H2] ${handTwoAbc}`;
      }
    });

    // console.log(abc);
    return abc;
  };

  // the three big callback functions below (eventCallback, sequenceCallback and beatCallback) are returned with getter functions, because in ABCJS the parameters that can be passed into these callbacks are already pre-defined.
  const getEventCallback = (
    colorElements,
    musicIsPlaying,
    setMusicIsPlaying
  ) => {
    // the function to change colours to red
    const eventCallback = (ev) => {
      if (!ev) {
        setMusicIsPlaying(!musicIsPlaying);
        return;
      }

      colorElements(ev.elements);
    };

    return eventCallback;
  };

  const getBeatCallback = (
    allNoteEvents,
    setSliderPosition,
    tempo = 180,
    currentMusicalSectionIndex,
    beatsPerMeasure
  ) => {
    // this runs every beat
    const beatCallback = async (beatNumber, totalBeats) => {
      // console.log({ beatNumber });

      // array of MIDI pitches currently playing (e.g. [60, 62])
      // const currentPitches = allNoteEvents
      //   .filter((e) => e.beatNumber === beatNumber)
      //   .map((e) => e.pitch);
      // since I've added an abcNoteName to each event, I can also get the abcPitches
      const currentAbcPitches = allNoteEvents
        .filter((e) => e.beatNumber === beatNumber)
        .map((e) => e.abcNoteName);

      // get indices of current tines playing
      const currentTinesPlaying = tines
        .map((tine, index) => {
          return { ...tine, index };
        })
        .filter((tine) => currentAbcPitches.includes(tine.abcNote))
        .map((tine) => tine.index);
      // console.log({ allNoteEvents });
      // console.log({ currentPitches });
      // console.log({ currentAbcPitches });
      // console.log({ currentTinesPlaying });

      // how long the tone should be colored for (depends on the tempo).
      const fullLengthOfBeat = (1000 * 60) / tempo;
      const msToChangeColor = fullLengthOfBeat - 30000 / tempo;

      // change colour of tines active in current beat
      tines.forEach((tine, index) => {
        if (currentTinesPlaying.includes(index)) {
          const tineEl = document.querySelector('#tine-' + index);
          tineEl.classList.add('active-tine');
          // after a time interval, remove the "active-tine" class, thereby removing the color
          setTimeout(() => {
            tineEl.classList.remove('active-tine');
          }, msToChangeColor);
        }
      });

      // console.log({ currentMusicalSectionIndex });
      // make the current note grid row different colour
      if (currentMusicalSectionIndex !== undefined) {
        // console.log('test2');
        const currentMeasure =
          beatNumber === totalBeats
            ? 0
            : Math.floor(beatNumber / beatsPerMeasure);
        const currentBeatInMeasure =
          beatNumber === totalBeats
            ? 0
            : beatNumber - currentMeasure * beatsPerMeasure;

        const rowId = `musicalSection-${currentMusicalSectionIndex}-measure-${currentMeasure}-beat-${currentBeatInMeasure}`;

        const currentRowEl = document.getElementById(rowId);
        const allMeasuresEl = currentRowEl.parentNode.parentNode;
        // first, remove green color from any other row in current musical section.
        const allNodesInMeasure = allMeasuresEl.getElementsByTagName('button');
        for (let i = 0; i < allNodesInMeasure.length; i++) {
          allNodesInMeasure[i].classList.remove('active-row');
        }

        // now add green color to current row
        const currentRowNodes = currentRowEl.getElementsByTagName('button');

        for (let i = 0; i < currentRowNodes.length; i++) {
          currentRowNodes[i].classList.add('active-row');
        }

        // for (let i = 0; i < nodes.length; i++) {
        //   if (nodes[i].nodeName.toLowerCase() == 'div') {
        //     nodes[i].classList.add('active-tine');
        //     setTimeout(() => {
        //       nodes[i].classList.remove('active-tine');
        //     }, msToChangeColor);
        //   }
        // }

        // console.log({ rowId });
        // rowEl.classList.add('active-tine');
        // after a time interval, remove the "active-tine" class, thereby removing the color
        // setTimeout(() => {
        //   rowEl.classList.remove('active-tine');
        // }, msToChangeColor);
      }

      // move the position of the audio slider
      setSliderPosition((beatNumber / totalBeats) * 100);
    };

    return beatCallback;
  };

  const getSequenceCallback = (setAllNoteEvents) => {
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
          // const measure = Math.floor((event.start * 8) / beatsPerMeasure);

          // console.log({ beatsPerMeasure });

          //calculate which overall beat this event falls on (event.start measures in 8th notes, so multiply by 8)
          const beatNumber = event.start * 8;

          // calculate which beat this is within the current measure
          // const beatInMeasure = beatFromStart - measure * beatsPerMeasure;

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
            // measure,
            beatNumber,
            // beatInMeasure,
            midiNoteName,
            abcNoteName,
          });
        });
      });

      setAllNoteEvents(newAllNoteEvents);
      // console.log({ newAllNoteEvents });
    };

    return sequenceCallback;
  };

  // load sheet music score from correctly-formatted abc notation into a specific div. Must pass in the "synth" object loaded with "new abcjs.synth.CreateSynth();" (inside a useEffect)
  const initializeMusic = async (visualObj, synth, sequenceCallback) => {
    // console.log({ abc, idForScoreDiv, synth });

    // const visualObj = abcjs.renderAbc(idForScoreDiv, abc, {
    //   responsive: 'resize',
    //   add_classes: true,
    // })[0];

    // let allNoteEvents = [];

    try {
      // const synth = new abcjs.synth.CreateSynth();

      //should the below line be here?
      await audioContext.resume();
      // In theory the AC shouldn't start suspended because it is being initialized in a click handler, but iOS seems to anyway.

      await synth.init({
        audioContext: audioContext,
        visualObj: visualObj,
        options: {
          sequenceCallback: sequenceCallback,
          soundFontUrl: 'soundfonts',
          onEnded: () => {
            //console.log("playback ended")
          },
        },
      });

      await synth.prime();
      // synth.start();

      //console.log("note played");
    } catch (error) {
      console.log('Audio failed', error);
    }
  };

  const resetPlayback = (
    synth,
    timingCallbacks,
    setMusicIsPlaying,
    setSliderPosition
  ) => {
    setMusicIsPlaying(false);
    timingCallbacks.stop();
    setSliderPosition(0);
    synth.stop();
    // remove any remaining red coloration
    Array.from(document.querySelectorAll('.color')).forEach((el) =>
      el.classList.remove('color')
    );
  };

  const goToSpecificPlaceInSong = async (position, synth, timingCallbacks) => {
    //console.log({position});
    await synth.seek(position);
    timingCallbacks.setProgress(position);
  };

  const startPause = async (
    synth,
    timingCallbacks,
    musicIsPlaying,
    setMusicIsPlaying,
    sliderPosition
  ) => {
    const newMusicIsPlaying = !musicIsPlaying;
    // console.log({ newMusicIsPlaying });
    // console.log({ timingCallbacks });
    if (musicIsPlaying) {
      await synth.pause();
      timingCallbacks.pause();
    } else {
      await synth.start();
      // if slider is at 0, make sure it starts at the very beginning
      sliderPosition > 0 ? timingCallbacks.start() : timingCallbacks.start(0);
    }
    setMusicIsPlaying(newMusicIsPlaying);
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        beatsPerMeasure,
        setBeatsPerMeasure,
        tines,
        setTines,
        toneRowStrings,
        setToneRowStrings,
        thumbOneOrTwo,
        setThumbOneOrTwo,
        musicalSections,
        setMusicalSections,
        tempo,
        setTempo,
        key,
        setKey,
        hideAllSections,
        setHideAllSections,
        orderOfSections,
        setOrderOfSections,
        getRowNumFromIndex,
        replaceOneValueInArray,
        dateFromMs,
        createNewUser,
        updateUser,
        deleteUser,
        permissionToEditProject,
        changeOneNote,
        midiNoteNameToAbc,
        abcToMidiNoteName,
        midiNoteNameToNumber,
        midiNumberToMidiNoteName,
        noteGridToAbc,
        singleMusicalSectionToAbc,
        musicalSectionsToAbc,
        userPlayNote,
        initializeMusic,
        colorElements,
        resetPlayback,
        goToSpecificPlaceInSong,
        startPause,
        getEventCallback,
        getBeatCallback,
        getSequenceCallback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
