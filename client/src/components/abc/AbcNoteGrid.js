import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

//clickOnNoteButton(keyboardLetter, abcNote)

const AbcNoteGrid = ({ currentMusicalSectionIndex }) => {
  // const [row, setRow] = useState(1);
  const {
    tines,
    userPlayNote,
    getRowNumFromIndex,
    beatsPerMeasure,
    musicalSections,
    changeOneNote,
    thumbOneOrTwo,
  } = useContext(AppContext);
  // const rowBeatsTines = [];

  return (
    <div>
      {musicalSections[currentMusicalSectionIndex].measures.map(
        (measure, measureIndex) => {
          const uniqueMeasureId =
            'musicalSection-' +
            currentMusicalSectionIndex +
            '-measure-' +
            measureIndex;

          return (
            <NoteGridMeasure key={uniqueMeasureId} id={uniqueMeasureId}>
              {measure.map((beat, beatIndex) => {
                const uniqueBeatId = uniqueMeasureId + '-beat-' + beatIndex;
                return (
                  <NoteGridBeat key={uniqueBeatId} id={uniqueBeatId}>
                    {beat.map((note, noteIndex) => {
                      const uniqueNoteId = uniqueBeatId + '-note-' + noteIndex;
                      return (
                        <TimedNote
                          key={uniqueNoteId}
                          id={uniqueNoteId}
                          note={note}
                          onClick={() =>
                            changeOneNote(
                              currentMusicalSectionIndex,
                              measureIndex,
                              beatIndex,
                              noteIndex,
                              note,
                              thumbOneOrTwo
                            )
                          }
                        >
                          {note}
                        </TimedNote>
                      );
                    })}
                  </NoteGridBeat>
                );
              })}
              <ColoredLine />
            </NoteGridMeasure>
          );
        }
      )}
    </div>
  );
  //   return (
  //     <NoteGrid id='note-grid'>
  //       {tines.map((tine, index) => (
  //         <TimedNote
  //           className='timed-note'
  //           id='a-timed-note-1'
  //           onClick='setNoteInNoteGrid(this)'
  //         >
  //           0
  //         </TimedNote>
  //       ))}

  //       <NoteGridRow className='note-grid-row'>
  //         {/* <TimedNote
  //           className='timed-note'
  //           id='a-timed-note-1'
  //           onClick='setNoteInNoteGrid(this)'
  //         > */}
  //       </NoteGridRow>

  //       <NoteGridRow className='note-grid-row'>
  //         <TimedNote
  //           className='timed-note'
  //           id='a-timed-note-2'
  //           onClick='setNoteInNoteGrid(this)'
  //         >
  //           0
  //         </TimedNote>
  //       </NoteGridRow>

  //       {/* <button onClick='getAbcFromNoteGrid()'>Get ABC from note grid</button> */}
  //     </NoteGrid>
  //   );
};

const NoteGridMeasure = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ColoredLine = styled.hr`
  background-color: var(--color-dark-grey);
  height: 2px;
  width: 100%;
  border: 0;
`;

const NoteGridBeat = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const TimedNote = styled.button`
  width: 30px;
  height: 20px;
  margin: 0;
  padding: 1px 1px;
  font-size: inherit;
  background: var(--color-very-light-green);
  border: 1px solid var(--color-dark-grey);
  border-radius: 4px;
  ${({ note }) =>
    note === 0
      ? `
    color: grey;
  `
      : note === 1
      ? `color: black`
      : `color: var(--color-cadmium-red)`}
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
`;

export default AbcNoteGrid;
