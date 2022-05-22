import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcNoteGrid = () => {
  return (
    <NoteGrid id='note-grid'>
      <NoteGridRow className='note-grid-row'>
        <TimedNote
          className='timed-note'
          id='a-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='w-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='s-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='e-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='d-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='r-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='f-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='t-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='g-timed-note-1'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
      </NoteGridRow>

      <NoteGridRow className='note-grid-row'>
        <TimedNote
          className='timed-note'
          id='a-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='w-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='s-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='e-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='d-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='r-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='f-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          class='timed-note'
          id='t-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
        <TimedNote
          className='timed-note'
          id='g-timed-note-2'
          onClick='setNoteInNoteGrid(this)'
        >
          0
        </TimedNote>
      </NoteGridRow>

      {/* <button onClick='getAbcFromNoteGrid()'>Get ABC from note grid</button> */}
    </NoteGrid>
  );
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
