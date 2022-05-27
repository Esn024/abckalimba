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

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        beatsPerMeasure,
        setBeatsPerMeasure,
        tines,
        userPlayNote,
        setTines,
        thumbOneOrTwo,
        setThumbOneOrTwo,
        musicalSections,
        setMusicalSections,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
