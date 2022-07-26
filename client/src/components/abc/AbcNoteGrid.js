import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcNoteGrid = ({ currentMusicalSectionIndex }) => {
  const {
    tines,
    musicalSections,
    changeOneNote,
    thumbOneOrTwo,
    saveImageById,
    projectName,
    indexToAlphabetLetter,
  } = useContext(AppContext);

  return (
    <>
      <div id={'musicalSection-' + currentMusicalSectionIndex}>
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
                        const uniqueNoteId =
                          uniqueBeatId + '-note-' + noteIndex;
                        return (
                          tines && (
                            <TimedNote
                              key={uniqueNoteId}
                              id={uniqueNoteId}
                              className={`note${note}`}
                              note={note}
                              onClick={() => {
                                // tine-0-key-a
                                document
                                  .getElementById('tine-' + noteIndex)
                                  .click();

                                changeOneNote(
                                  currentMusicalSectionIndex,
                                  measureIndex,
                                  beatIndex,
                                  noteIndex,
                                  note,
                                  thumbOneOrTwo
                                );
                              }}
                            >
                              {tines[noteIndex].abcNote}
                            </TimedNote>
                          )
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
      <StyledButton
        onClick={() => {
          const idOfDiv = `musicalSection-${currentMusicalSectionIndex}`;
          const filename = `${
            projectName ?? 'Untitled'
          } - Section ${indexToAlphabetLetter(currentMusicalSectionIndex)}`;
          saveImageById(idOfDiv, filename);
        }}
      >
        Save music grid as image
      </StyledButton>
    </>
  );
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
  /* background: var(--color-very-light-green); */
  border: 1px solid var(--color-dark-grey);
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: var(--color-dark-green);
  }
`;

const StyledButton = styled.button`
  font-size: var(--font-size-smaller);
`;

export default AbcNoteGrid;
