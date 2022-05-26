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
  } = useContext(AppContext);
  const rowBeatsTines = [];

  return (
    <div>
      {musicalSections[currentMusicalSectionIndex].musicalGridArray.map(
        (measure, index) => (
          <div key={index}>measure 1</div>
        )
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

const NoteGrid = styled.div``;

const NoteGridRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const TimedNote = styled.button`
  width: 30px;
  height: 30px;
  margin: 0 4px;
  padding: 5px 10px;
  font-size: inherit;
  background: #e2fdf1;
  border: 1px solid #5c5c5c;
  border-radius: 4px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
`;

export default AbcNoteGrid;
