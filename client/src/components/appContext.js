import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
import abcjs from 'abcjs';
import { saveAsPng } from 'save-html-as-image';

// import useCurrentUser from '../hooks/use-local-current-user.hook.js';

export const AppContext = createContext();

// context provider
export const AppProvider = ({ children }) => {
  const validAbcNoteRegex = /[\^_]?[a-gA-G][',]{0,4}/;
  const validMidiNoteRegex = /[A-G][b#]?[0-8]/;

  // this determines who the user is
  // TODO could be improved
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const [currentUser, setCurrentUser] = useState(null);

  // set the current user if the userID is present in localstorage
  useEffect(() => {
    // fetch user info
    const fetchCurrentUser = async (userId) => {
      const response = await fetch(`/api/users/id/${userId}`);
      const resJSON = await response.json();
      const user = resJSON.data;

      // console.log({ user });
      // update the current user
      if (user) setCurrentUser(user);
    };

    // if there is a user id, run the fetchCurrentUser function
    if (userId) {
      fetchCurrentUser(userId);
    }

    // cleanup
    return () => {
      setCurrentUser(null);
    };
  }, [userId]);

  const [audioContext, setAudioContext] = useState(new window.AudioContext());
  const [musicInitialized, setMusicInitialized] = useState(false);

  // const [synth, setSynth] = useState(new abcjs.synth.CreateSynth());
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [tempo, setTempo] = useState(180);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectVisibility, setProjectVisibility] = useState('private');
  const [key, setKey] = useState('C');
  const [orderOfSections, setOrderOfSections] = useState('AA');

  const [hideAllSections, setHideAllSections] = useState(false);
  const [hideAllGrids, setHideAllGrids] = useState(false);
  const [hideAllScores, setHideAllScores] = useState(false);
  const [tines, setTines] = useState([
    {
      keyboardLetter: 'a',
      abcNote: 'a',
      cents: 0,
      color: 0,
    },
    {
      keyboardLetter: 'w',
      abcNote: 'b',
      cents: 0,
      color: 1,
    },
    {
      keyboardLetter: 's',
      abcNote: 'c',
      cents: 0,
      color: 0,
    },
    {
      keyboardLetter: 'e',
      abcNote: 'd',
      cents: 0,
      color: 1,
    },
  ]);
  // what a click on the note-grid means. "1" is thumb one, "2" is thumb two. (if clicked again, notegrid toggles to "0" - a musical rest)
  const [thumbOneOrTwo, setThumbOneOrTwo] = useState(1);

  const [musicalSections, setMusicalSections] = useState([
    {
      letterId: 'A',
      description: '',
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
    '5 tones (c d e f g) [awsed] {.....}',
    '6 tones (c d e f g a) [awsedr] {......}',
    '7 tones (c d-20 e f+20 g a b) [awsedrf] {.l.l.l.}',
    '17 tones (^c-40 ^g-40 B-20 ^f-20 A e ^C-40 a A, d+20 E e ^F-20 ^f-20 ^G-40 ^g-40 A) [awsedrftgyhujikol] {.l.l.l.l.l.l.l.l.}',
  ]);

  // convert a tone row string into a properly-organized tines object
  const toneRowStrToObj = (str) => {
    // console.log({ str });
    if (str) {
      // regexp for a string input missing the keyboard letter and colors info. If they're missing, they should be added in automatically

      // the below regexp assumes a string input of the sort that the tone rows are stored in in the DB of the site
      const toneRowStrRegexp =
        /(^\d+)\stones\s\(([-^_+',a-gA-G\s\d]{2,})\)\s\[([a-z]{2,})\]\s{([\.l]{2,})}/;
      // the below regexp is for capturing info about one abcNote and any tuning adjustment
      const abcNoteAndCentsRegexp = /([\^_]?[a-gA-G][',]{0,4})(([-+])(\d+))?/;

      const result = str.match(toneRowStrRegexp);

      // console.log({ result });

      if (result) {
        // const numberOfTones = result[1] * 1;
        const abcNotesAndCentsStr = result[2];
        const keyboardLettersStr = result[3];
        const colorsStr = result[4];

        const keyboardLetters = keyboardLettersStr.split('');
        const colors = colorsStr
          .split('')
          .map((symbol) => (symbol === '.' ? 0 : 1));

        const tinesArr = abcNotesAndCentsStr.split(' ').map((str, index) => {
          const result = str.match(abcNoteAndCentsRegexp);

          const keyboardLetter = keyboardLetters[index];
          const color = colors[index] * 1;

          const abcNote = result[1];

          const tuningPlusOrMinus = result[3];
          const centsAmount = result[4];
          const cents = centsAmount
            ? tuningPlusOrMinus === '+'
              ? centsAmount * 1
              : centsAmount * -1
            : 0;

          return { keyboardLetter, abcNote, cents, color };
        });

        // console.log({ tines, tinesArr });
        return tinesArr;
      }
    }
  };

  // convert a properly-organized tines object into a tone row string
  const objToToneRowStr = (tines) => {
    //TODO check that tines is corrent
    if (tines) {
      let abcNotesAndCentsArr = [];
      let keyboardLettersStr = '';
      let colorsStr = '';
      const numberOfTones = tines.length;

      tines.forEach((tine) => {
        // if empty values, just add "c"
        keyboardLettersStr +=
          tine.keyboardLetter.length > 0 ? tine.keyboardLetter : 'c';
        colorsStr += tine.color === 0 ? '.' : 'l';
        let abcNoteAndCentsStr = tine.abcNote.match(validAbcNoteRegex)
          ? tine.abcNote
          : 'C,,';
        abcNoteAndCentsStr +=
          tine.cents > 0
            ? `+${tine.cents.toString()}`
            : tine.cents === 0
            ? ''
            : tine.cents.toString();
        abcNotesAndCentsArr.push(abcNoteAndCentsStr);
      });
      const allAbcNotesAndCentsStr = abcNotesAndCentsArr.join(' ');

      const finalStr = `${numberOfTones} tones (${allAbcNotesAndCentsStr}) [${keyboardLettersStr}] {${colorsStr}}`;

      // console.log({ finalStr });
      return finalStr;
    }
  };

  const updateMusicalSectionsAfterTineNumberChange = (
    newNumberOfTines,
    tines,
    musicalSections,
    setMusicalSections
  ) => {
    let modifiedMusicalSections = [];
    let modifiedMeasures = [];
    let modifiedMeasure = [];
    let modifiedBeat = [];

    const tinesHaveBeenAdded = newNumberOfTines > tines.length;
    const numberOfNewTinesAdded = newNumberOfTines - tines.length;

    // also change musicalSections (add or remove the right number of columns in the measures array)
    // creating a modifiedMusicalSections object with the necessary changes
    musicalSections.forEach((musicalSection, index) => {
      musicalSection.measures.forEach((measure) => {
        measure.forEach((beatRow) => {
          //if new # of tines is longer than previous one, keep previous data & add the right number of empty values; if shorter, remove some
          modifiedBeat = tinesHaveBeenAdded
            ? [...beatRow, ...Array(numberOfNewTinesAdded).fill(0)]
            : beatRow.slice(0, newNumberOfTines);
          modifiedMeasure.push(modifiedBeat);
          // reset
          modifiedBeat = [];
        });
        modifiedMeasures.push(modifiedMeasure);
        // reset
        modifiedMeasure = [];
      });
      modifiedMusicalSections.push({
        ...musicalSections[index],
        measures: modifiedMeasures,
      });
      // reset
      modifiedMeasures = [];
    });

    // finally, update state with the modified object
    setMusicalSections(modifiedMusicalSections);
  };

  const updateTinesAfterTineNumberChange = (
    newNumberOfTines,
    tines,
    setTines
  ) => {
    const tinesHaveBeenAdded = newNumberOfTines > tines.length;
    const numberOfNewTinesAdded = newNumberOfTines - tines.length;

    //if new # of tines is longer than previous one, keep previous data & add the right number of empty values; if shorter, remove some
    setTines(
      tinesHaveBeenAdded
        ? [
            ...tines,
            ...Array.from({
              length: numberOfNewTinesAdded,
            }).map(() => ({
              keyboardLetter: '',
              abcNote: '',
              cents: 0,
              color: 0,
            })),
          ]
        : tines.slice(0, newNumberOfTines)
    );
  };

  const updateDescriptionOfMusicalSection = (
    currentMusicalSectionIndex,
    newDescription
  ) => {
    let newMusicalSections = [...musicalSections];
    const newMusicalSection = {
      ...musicalSections[currentMusicalSectionIndex],
      description: newDescription,
    };
    newMusicalSections[currentMusicalSectionIndex] = newMusicalSection;
    setMusicalSections(newMusicalSections);
  };

  const navigate = useNavigate();

  // return human-readable date from milliseconds since 1970
  const dateFromMs = (ms) => {
    const date = new Date(ms);
    const str = date.toString();
    return ms ? str.substring(0, 24) : '';
  };

  // test if two different objects have the same properties and values. From https://stackoverflow.com/a/32922084
  const deepEqual = (x, y) => {
    const ok = Object.keys,
      tx = typeof x,
      ty = typeof y;
    return x && y && tx === 'object' && tx === ty
      ? ok(x).length === ok(y).length &&
          ok(x).every((key) => deepEqual(x[key], y[key]))
      : x === y;
  };

  //try to sign in as user upon entering username and password
  const handleSignIn = (username, password) => {
    // console.log({ formData });

    fetch(`/api/users/signin/${username}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const { status, message, data } = json;

        if (status == 200 || status == 202) {
          setUserId(data);
          // add it to localStorage
          localStorage.setItem('userId', data);

          // return to homepage
          navigate('/');
        } else {
          // TODO remove console log
          console.log('There was an error', { status, message, data });
        }
      });
  };

  const handleSignOut = () => {
    setUserId(null);
    localStorage.removeItem('userId');
    setCurrentUser(null);
    // go to home page
    navigate('/');
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
    // console.log({ formData });
    const replacementUserData = { ...formData, modified: Date.now() };

    fetch(`/api/users/id/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(replacementUserData),
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
          // TODO remove console log?
          console.log(
            `Successfully changed user info for ${formData.username}`
          );
          setCurrentUser(replacementUserData);
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

  //find how many times index goes into number of tines. TODO this function is not currently used. What was it originally to be used for?
  const getRowNumFromIndex = (tines, index) => {
    return Math.floor((index + 1) / tines.length);
  };

  //TODO rewrite this to not use abcjs at all, just convert the abc note to MIDI pitch and add cents
  const userPlayNote = async (abcNoteName, cents = 0) => {
    const synth = new abcjs.synth.CreateSynth();
    // console.log('userPlayNote', abcNoteName);
    const abcNoteNameIsValid = abcNoteName.match(validAbcNoteRegex);
    if (abcNoteNameIsValid) {
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
        // console.log(audioContext.state);

        if (audioContext.state !== 'running') await audioContext.resume();
        // In theory the AC shouldn't start suspended because it is being initialized in a click handler, but iOS seems to anyway.

        // console.log('PUBLIC_URI', `${process.env.PUBLIC_URL}/soundfonts`);

        await synth.init({
          audioContext: audioContext,
          visualObj: visualObj,
          options: {
            sequenceCallback: sequenceCallbackOneNote,
            soundFontUrl: `${process.env.PUBLIC_URL}/soundfonts`,
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

  // change value of one note in a musical section
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
    const midiNoteNameIsValid = midiNoteName.match(validMidiNoteRegex);

    if (midiNoteNameIsValid) {
      let abcNoteName = '';
      let noteName = midiNoteName.match(/([A-G])/)[1];
      let octave = midiNoteName.match(/([0-8])/)[1];
      let flat = midiNoteName.includes('b');
      let sharp = midiNoteName.includes('#');

      if (flat) abcNoteName += '_';
      if (sharp) abcNoteName += '^';
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
    }
  };

  //helper function. Convert an ABC note name to scientific notation (midi note name). For now, always returns flat notes
  const abcToMidiNoteName = (abcNoteName) => {
    const abcNoteNameIsValid = abcNoteName.match(validAbcNoteRegex);
    if (abcNoteNameIsValid) {
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
    }
  };

  //helper function. Convert scientific notation (midi note name) to midi number.
  const midiNoteNameToNumber = (midiNoteName) => {
    const midiNoteNameIsValid = midiNoteName.match(validMidiNoteRegex);

    if (midiNoteNameIsValid) {
      let noteName = midiNoteName.match(/([A-G])/)[1];
      let octave = midiNoteName.match(/([0-8])/)[1];
      let flat = midiNoteName.includes('b');
      let sharp = midiNoteName.includes('#');
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
      // check if there's a sharp
      if (sharp) midiNumber++;
      //now return the right midiNumber for the octave
      return midiNumber + 12 * parseInt(octave);
    }
  };

  //convert one ABC note to a midi number
  const abcToMidiNumber = (abcNoteName) => {
    const abcNoteNameIsValid = abcNoteName.match(validAbcNoteRegex);
    if (abcNoteNameIsValid) {
      return midiNoteNameToNumber(abcToMidiNoteName(abcNoteName));
    }
  };

  //helper function. Convert midi number to scientific notation (midi note name). This uses abcjs's built-in converter
  const midiNumberToMidiNoteName = (midiNumber) => {
    return abcjs.synth.pitchToNoteName[midiNumber];
  };

  //helper function. Convert midi number to ABC note name. Finds the first matching abcNote value within the tines array (if there are both ^g (G-sharp) and _a (A-flat), it will return only one of them)
  const midiNumberToAbc = (midiNumber, tines = tines) => {
    return tines
      .find((tine) => abcToMidiNumber(tine.abcNote) === midiNumber)
      .map((tine) => tine.abcNote);
  };

  // function and variable to do with adding & removing the CSS that gives a red color to elements that are "playing" (in the sheet music notation)
  const colorElements = (currentEls) => {
    // console.log({ currentEls });
    // check if there is a new note, or if there are only rests
    let newNote = false;
    currentEls.forEach((el) => {
      // console.log(el[0]);
      // console.log(el[0].dataset.name);
      if (el[0].dataset.name === 'note') {
        newNote = true;
      }
    });
    // console.log({ newNote });
    //if there is a new note, remove any previous color, otherwise keep it until a new note shows up
    if (newNote) {
      // remove any earlier coloration
      Array.from(document.querySelectorAll('.color')).forEach((el) =>
        el.classList.remove('color')
      );
    }

    //currentEls.forEach((currentEl) => {});
    for (let i = 0; i < currentEls.length; i++) {
      //console.log('currentEls[i]', currentEls[i]);
      for (let j = 0; j < currentEls[i].length; j++) {
        // console.log(
        //   `currentEls[${i}][${j}].classList`,
        //   currentEls[i][j].classList
        // );
        currentEls[i][j].classList.add('color');
      }
    }
  };

  // convert measures stored in the format of a note grid array into abc notation (returns a 2-item array of abc for the left and right hand)
  const noteGridToAbc = (measures, key = 'C') => {
    let handOneAbcNotesThisBeat = [];
    let handTwoAbcNotesThisBeat = [];

    let handOneAbc = '';
    let handTwoAbc = '';

    // if any notes are held over from previous beat, value > 1
    let handOneNoteDuration = 1;
    let handTwoNoteDuration = 1;

    measures.forEach((measure) => {
      //noteduration
      //multiplenotes [g2b2]
      //there is a new note
      //a metrical division (either ' ' if also new note, or '-' to have a tie) [g2b2-g4b4]
      /* 7 - 4/3
      8 - 4/4
      12 - 4/4/4
      16 - 4/4/4/4
      20 - 4/4/4/4/4
      */
      // check at beginning of NEXT beat whether to place notes for previous beat, or else place what you have if it's the last beat

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
    const [handOneAbc, handTwoAbc] = noteGridToAbc(measures, key);

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
    key = 'C',
    projectName = ''
  ) => {
    // TODO may need to update the below line later in case this number will be able to change mid-piece
    const beatsPerBar = musicalSections[0].measures[0].length;

    //TODO this currently assumes that musicalSections have no numbers in them, are a simple format like ABAC
    const musicalSectionsArr = orderOfSections.split('');

    let abc = `X:1
T:${projectName}
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

  // get the name of one abc note from an abc string, given a start and end character
  const getOneAbcNoteFromStr = (abcStr, start, end) => {
    return abcStr.slice(start, end).trim();
  };

  // the three big callback functions below (eventCallback, sequenceCallback and beatCallback) are returned with getter functions, because in ABCJS the parameters that can be passed into these callbacks are already pre-defined.
  // the eventCallback actually runs every single 8th note (because the note grid is transformed into an abc string in such a way that there is one event every 8th note, even if it's an 8th rest)
  const getEventCallback = (
    colorElements,
    musicIsPlaying,
    setMusicIsPlaying,
    abc,
    currentMusicalSectionIndex
  ) => {
    // the function to change colours to green
    const eventCallback = (ev) => {
      if (!ev) {
        setMusicIsPlaying(!musicIsPlaying);
        return;
      }

      // add red color to currently playing notes in the sheet music. TODO this doesn't currently work when a musical section is first loaded, but it works after anything changes and for final piece
      colorElements(ev.elements);
      // console.log({ ev });
      // console.log({ abc });

      // measure number, beginning with 0
      const measureNumber = ev.measureNumber;
      // beat number in measure, beginning with 0 (grab the beat number from the DOM element class beginning with "abcjs-n")
      const beatNumber =
        ev.elements[0][0].className.baseVal.match(/abcjs-n([0-9]+)/)[1] * 1;
      // console.log({ beatNumber });
      // beat number since start of song
      // const beatNumberSinceStart = ev.elements[0][0].dataset.index * 1;
      // console.log({ beatNumberSinceStart });
      // ev.elements[0][0].dataset.index*1

      // console.log({ currentMusicalSectionIndex });
      // console.log({ musicalSections });

      // console.log({
      //   measureNumber,
      //   beatNumber
      // });

      //add green colour to the currently playing notes of the visual music keyboard

      // array of MIDI pitches currently playing (e.g. [60, 62])
      // const currentPitches = ev.midiPitches.map((e) => e.pitch);

      // get indices of current tines playing,
      let currentTinesPlayingIndices;

      // based on note grid, if one exists (this isn't the "final" piece, and there IS a currentMusicalSectionIndex)
      if (currentMusicalSectionIndex !== undefined) {
        currentTinesPlayingIndices = musicalSections[
          currentMusicalSectionIndex
        ].measures[measureNumber][beatNumber].reduce(
          (arr, e, i) => (e !== 0 && arr.push(i), arr),
          []
        );

        // console.log({ currentTinesPlayingIndices });
      } else {
        // get the abcNotes currently playing from the abc string (this also includes "z" rests)
        let currentAbcNotes = [];
        for (let i = 0; i < ev.endCharArray.length; i++) {
          currentAbcNotes.push(
            getOneAbcNoteFromStr(abc, ev.startCharArray[i], ev.endCharArray[i])
          );
        }
        // console.log({ currentAbcNotes });

        // get indices of current tines playing based on currentAbcNotes (this has the flaw of not differentiating between duplicate notes in the instrument's tuning, and getting ALL indices of a note. However, it may be the only option for "final piece", where a note grid is absent, at least for now)
        currentTinesPlayingIndices = tines
          .map((tine, index) => {
            return { ...tine, index };
          })
          .filter((tine) =>
            // currentPitches.includes(abcToMidiNumber(tine.abcNote))
            currentAbcNotes.includes(tine.abcNote)
          )
          .map((tine) => tine.index);
        // console.log({ currentPitches });
        // console.log({ currentTinesPlayingIndices });
      }

      // get indices of current tines playing based on currentAbcNotes (this has the flaw of not differentiating between duplicate notes in the instrument's tuning, and getting ALL indices of a note. However, it may be the only option for "final piece", where a note grid is absent, at least for now)
      // const currentTinesPlayingIndices = tines
      //   .map((tine, index) => {
      //     return { ...tine, index };
      //   })
      //   .filter((tine) =>
      //     // currentPitches.includes(abcToMidiNumber(tine.abcNote))
      //     currentAbcNotes.includes(tine.abcNote)
      //   )
      //   .map((tine) => tine.index);
      // console.log({ currentPitches });
      // console.log({ currentTinesPlayingIndices });

      // how long the tone should be colored for (depends on the tempo).
      const fullLengthOfBeat = (1000 * 60) / tempo;
      const msToChangeColor = fullLengthOfBeat - 30000 / tempo;

      // change colour of tines active in current beat
      tines.forEach((tine, index) => {
        if (currentTinesPlayingIndices.includes(index)) {
          const tineEl = document.querySelector('#tine-' + index);
          if (tineEl) {
            tineEl.classList.add('active-tine');
            // after a time interval, remove the "active-tine" class, thereby removing the color
            setTimeout(() => {
              tineEl.classList.remove('active-tine');
            }, msToChangeColor);
          }
        }
      });

      // make the current note grid row different colour
      if (currentMusicalSectionIndex !== undefined) {
        // console.log('test2');
        const rowId = `musicalSection-${currentMusicalSectionIndex}-measure-${measureNumber}-beat-${beatNumber}`;
        // console.log({ rowId });

        const currentRowEl = document.getElementById(rowId);

        if (currentRowEl) {
          const allMeasuresEl = currentRowEl.parentNode.parentNode;
          // first, remove green color from any other row in current musical section.
          const allNodesInMeasure =
            allMeasuresEl.getElementsByTagName('button');
          for (let i = 0; i < allNodesInMeasure.length; i++) {
            allNodesInMeasure[i].classList.remove('active-row');
          }

          // now add green color to current row
          const currentRowNodes = currentRowEl.getElementsByTagName('button');

          for (let i = 0; i < currentRowNodes.length; i++) {
            currentRowNodes[i].classList.add('active-row');
          }
        }
      }
    };

    return eventCallback;
  };

  const getBeatCallback = (
    setSliderPosition
    // currentMusicalSectionIndex,
    // beatsPerMeasure
  ) => {
    // this runs every beat
    const beatCallback = async (beatNumber, totalBeats) => {
      // move the position of the audio slider
      setSliderPosition((beatNumber / totalBeats) * 100);
    };

    return beatCallback;
  };

  const getSequenceCallback = (setAllNoteEvents, currentMusicalSection) => {
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
          // console.log({ event });
          //which measure this event is in
          // const measure = Math.floor((event.start * 8) / beatsPerMeasure);

          // console.log({ beatsPerMeasure });

          //calculate which overall beat this event falls on (event.start measures in 8th notes, so multiply by 8)
          const beatNumber = event.start * 8;

          // calculate which beat this is within the current measure
          // const beatInMeasure = beatNumber - measure * beatsPerMeasure;

          // MIDI (scientific notation) note name
          const midiNoteName = midiNumberToMidiNoteName(event.pitch);

          // ABC notation note name
          const abcNoteName = midiNoteNameToAbc(midiNoteName);

          //TODO check if this will work getOneAbcNoteFromStr(abc, ev.startCharArray[i], ev.endCharArray[i]);

          // apply any tuning modifications set by the user.
          tines.forEach((tine) => {
            if (event.pitch === abcToMidiNumber(tine.abcNote)) {
              event.cents = tine.cents;
            }
          });

          // make a new object to add to the array of all note events. Also add a new beat property to each one
          const newObj = {
            ...event,
            // measure,
            beatNumber,
            // beatInMeasure,
            midiNoteName,
            abcNoteName,
          };

          // console.log({ newObj });

          newAllNoteEvents.push(newObj);
        });
      });

      setAllNoteEvents(newAllNoteEvents);
      // console.log({ currentMusicalSection });
      // console.log({ newAllNoteEvents });
    };

    return sequenceCallback;
  };

  // load sheet music score from correctly-formatted abc notation into a specific div. Must pass in the "synth" object loaded with "new abcjs.synth.CreateSynth();" (inside a useEffect)
  const initializeMusic = async (visualObj, synth, sequenceCallback) => {
    // console.log('initialize music');

    // console.log('PUBLIC_URI', `${process.env.PUBLIC_URL}/soundfonts`);

    try {
      await synth.init({
        audioContext: audioContext,
        visualObj: visualObj,
        options: {
          sequenceCallback: sequenceCallback,
          soundFontUrl: `${process.env.PUBLIC_URL}/soundfonts`,
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

  const resetPlayback = async (
    synth,
    timingCallbacks,
    setMusicIsPlaying,
    setSliderPosition,
    currentMusicalSectionIndex
  ) => {
    setMusicIsPlaying(false);

    if (audioContext.state !== 'running') await audioContext.resume();

    if (timingCallbacks) timingCallbacks.stop();
    setSliderPosition(0);
    synth.stop();
    // remove any remaining red coloration
    Array.from(document.querySelectorAll('.color')).forEach((el) =>
      el.classList.remove('color')
    );

    //remove any remaining green colour on any row inside the section
    if (
      currentMusicalSectionIndex !== 'final' &&
      currentMusicalSectionIndex !== undefined
    ) {
      const allMeasuresEl = document.getElementById(
        `musicalSection-${currentMusicalSectionIndex}`
      );
      if (allMeasuresEl) {
        const allNodesInMeasure = allMeasuresEl.getElementsByTagName('button');
        for (let i = 0; i < allNodesInMeasure.length; i++) {
          allNodesInMeasure[i].classList.remove('active-row');
        }
      }
    }
  };

  const goToSpecificPlaceInSong = async (position, synth, timingCallbacks) => {
    if (audioContext.state !== 'running') await audioContext.resume();
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
    if (audioContext.state !== 'running') await audioContext.resume();
    // console.log('startPause', synth);
    const newMusicIsPlaying = !musicIsPlaying;
    // console.log({ newMusicIsPlaying });
    // console.log({ timingCallbacks });
    if (musicIsPlaying) {
      await synth.pause();
      timingCallbacks.pause();
    } else {
      try {
        if (!timingCallbacks) {
          console.log('no timingCallbacks');
        } else {
          await synth.start();

          // if slider is at 0, make sure it starts at the very beginning
          sliderPosition > 0
            ? timingCallbacks.start()
            : timingCallbacks.start(0);
        }
      } catch (error) {
        console.log('Audio failed', error);
      }
    }
    setMusicIsPlaying(newMusicIsPlaying);
  };

  const printDivById = (divId) => {
    //abcjs-rest
    const divContents = document.getElementById(divId).innerHTML;
    let a = window.open('', '', 'height=500, width=500');
    // add custom CSS to make sure that the musical rests have a low opacity
    a.document.write(`<html><head>
    <style>
    .abcjs-rest {
      opacity: 0.1;
    }
    </style></head>
    <body>${divContents}</body></html>`);
    a.document.close();
    a.print();
  };

  //0 is A, 1 is B, etc.; 26 is a, 27 is b, etc.
  const indexToAlphabetLetter = (indexNumber) => {
    const charCode = indexNumber >= 26 ? indexNumber + 71 : indexNumber + 65;
    const alphabetLetter = String.fromCharCode(charCode);
    // console.log({ alphabetLetter });
    return alphabetLetter;
  };

  const saveImageById = (nodeId, filename) => {
    const node = document.getElementById(nodeId);
    saveAsPng(node, { filename: filename, printDate: true });
  };

  const saveNewProject = (
    setProject,
    projectName = '',
    projectDescription = '',
    projectVisibility,
    toneRowStr,
    musicalSections,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    username,
    forkedFromId = null // ID of the project it is forked from, if any
  ) => {
    // console.log({ formData });
    // console.log({ toneRowStr });
    // console.log({
    //   setProject,
    //   projectName,
    //   projectDescription,
    //   projectVisibility,
    //   toneRowStr,
    //   musicalSections,
    //   orderOfSections,
    //   tempo,
    //   key,
    //   beatsPerMeasure,
    //   username,
    // });

    const created = Date.now();
    fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({
        projectName: projectName,
        projectDescription: projectDescription,
        projectVisibility: projectVisibility,
        toneRowStr: toneRowStr,
        musicalSections: musicalSections,
        orderOfSections: orderOfSections,
        tempo: tempo,
        key: key,
        beatsPerMeasure: beatsPerMeasure,
        username: username,
        created: created,
        forkedFromId: forkedFromId,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const { status, message, data } = json;

        if (status == 207) {
          console.log(message);
          // console.log(data);
          setProject({
            projectName,
            projectDescription,
            projectVisibility,
            toneRowStr,
            musicalSections,
            orderOfSections,
            tempo,
            key,
            beatsPerMeasure,
            username,
            created,
            forkedFromId,
          });
          navigate(`/myprojects/${data[0].data.projectId}`);
          // scroll to top of page
          window.scrollTo(0, 0);
        } else {
          // TODO remove console log
          console.log('There was an error', { status, message, data });
        }
      });
  };

  const forkProject = (
    setProject,
    projectName,
    projectDescription,
    projectVisibility,
    toneRowStr,
    musicalSections,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    username,
    forkedFromId
  ) => {
    saveNewProject(
      setProject,
      projectName,
      projectDescription,
      projectVisibility,
      toneRowStr,
      musicalSections,
      orderOfSections,
      tempo,
      key,
      beatsPerMeasure,
      username,
      forkedFromId
    );
  };

  const updateProject = (
    setProject,
    privateProjectId,
    projectId,
    userId,
    projectName = '',
    projectDescription = '',
    projectVisibility,
    toneRowStr,
    musicalSections,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    username,
    created
  ) => {
    // console.log('update project client');
    // console.log({ toneRowStr });
    const modified = Date.now();
    fetch(`/api/projects/update/${projectId}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        privateProjectId: privateProjectId,
        projectId: projectId,
        projectName: projectName,
        projectDescription: projectDescription,
        projectVisibility: projectVisibility,
        toneRowStr: toneRowStr,
        musicalSections: musicalSections,
        orderOfSections: orderOfSections,
        tempo: tempo,
        key: key,
        beatsPerMeasure: beatsPerMeasure,
        username: username,
        created: created,
        modified: modified,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        const { status, message, data } = json;

        if (status == 207) {
          console.log(message);
          setProject({
            projectName,
            projectDescription,
            projectVisibility,
            toneRowStr,
            musicalSections,
            orderOfSections,
            tempo,
            key,
            beatsPerMeasure,
            username,
            created,
            modified,
          });
        } else {
          // TODO remove console log
          console.log('There was an error', { status, message, data });
        }
      });
  };

  return (
    <AppContext.Provider
      value={{
        audioContext,
        setAudioContext,
        musicInitialized,
        setMusicInitialized,
        userId,
        setUserId,
        currentUser,
        setCurrentUser,
        beatsPerMeasure,
        setBeatsPerMeasure,
        tines,
        setTines,
        updateTinesAfterTineNumberChange,
        updateMusicalSectionsAfterTineNumberChange,
        updateDescriptionOfMusicalSection,
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
        projectName,
        setProjectName,
        projectDescription,
        setProjectDescription,
        hideAllSections,
        setHideAllSections,
        hideAllGrids,
        setHideAllGrids,
        hideAllScores,
        setHideAllScores,
        orderOfSections,
        setOrderOfSections,
        projectVisibility,
        setProjectVisibility,
        toneRowStrToObj,
        objToToneRowStr,
        getRowNumFromIndex,
        replaceOneValueInArray,
        dateFromMs,
        deepEqual,
        createNewUser,
        handleSignIn,
        handleSignOut,
        updateUser,
        deleteUser,
        permissionToEditProject,
        changeOneNote,
        midiNoteNameToAbc,
        abcToMidiNoteName,
        midiNoteNameToNumber,
        midiNumberToMidiNoteName,
        midiNumberToAbc,
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
        printDivById,
        saveImageById,
        indexToAlphabetLetter,
        saveNewProject,
        updateProject,
        forkProject,
        validAbcNoteRegex,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
