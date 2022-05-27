import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfTines = () => {
  const [numberOfTines, setNumberOfTines] = useState(4);
  const { tines, setTines, musicalSections, setMusicalSections } =
    useContext(AppContext);

  let modifiedMusicalSections = [];
  let modifiedMeasures = [];
  let modifiedMeasure = [];
  let modifiedBeat = [];

  return (
    <>
      <StyledLabel>
        <Text>Number of Tines:</Text>
        <StyledInput
          type='number'
          id='quantity'
          name='quantity'
          min='3'
          max='21'
          value={numberOfTines}
          onChange={(e) => {
            const newNumberOfTines = e.target.value * 1;
            const tinesHaveBeenAdded = newNumberOfTines > tines.length;
            const numberOfNewTinesAdded = newNumberOfTines - tines.length;

            setNumberOfTines(newNumberOfTines);

            //if new # of tines is longer than previous one, keep previous data & add the right number of empty values; if shorter, remove some
            setTines(
              tinesHaveBeenAdded
                ? [
                    ...tines,
                    ...Array.from({
                      length: newNumberOfTines - tines.length,
                    }).map(() => ({
                      keyboardLetter: '',
                      abcNote: '',
                      cents: 0,
                    })),
                  ]
                : tines.slice(0, newNumberOfTines)
            );

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
          }}
        />
      </StyledLabel>
    </>
  );
};

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
`;

const StyledInput = styled.input`
  width: 50px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSetNumberOfTines;
