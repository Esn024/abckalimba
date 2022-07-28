import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfMusicalSections = () => {
  const {
    musicalSections,
    setMusicalSections,
    beatsPerMeasure,
    tines,
    indexToAlphabetLetter,
  } = useContext(AppContext);
  const [numberOfMusicalSections, setNumberOfMusicalSections] = useState(1);

  return (
    <>
      <StyledLabel>
        <Text title='Select number of musical sections in this piece, up to a maximum of 52. New sections will be added to the bottom. You can then order the musical sections in any order you like with the "Order of Sections" input at the bottom. The first 26 sections will be named the 26 letters of the alphabet, UPPERCASE, and the next 26 will be the same letters again but lowercase.'>
          Musical Sections:
        </Text>
        <StyledInput
          type='number'
          id='quantity'
          name='quantity'
          min='1'
          max='52'
          value={numberOfMusicalSections}
          onChange={(e) => {
            const newNumberOfMusicalSections = e.target.value * 1;
            setNumberOfMusicalSections(newNumberOfMusicalSections);
            //if new # of musical sections is longer than previous one, keep previous data & add the right number of empty values; if shorter, remove some
            setMusicalSections(
              newNumberOfMusicalSections > musicalSections.length
                ? [
                    ...musicalSections,
                    ...Array.from({
                      length:
                        newNumberOfMusicalSections - musicalSections.length,
                    }).map((el) => ({
                      // make sure that the 1st musical section is "A", the 2nd "B" and so on
                      letterId: `${indexToAlphabetLetter(
                        newNumberOfMusicalSections - 1
                      )}`,
                      description: '',
                      numberOfMeasures: 1,
                      // create a measures array 1 measure long, with as many columns as tines and as many rows as the # of beats per measure
                      measures: [
                        Array(beatsPerMeasure)
                          .fill(0)
                          .map((beatRow) => new Array(tines.length).fill(0)),
                      ],
                    })),
                  ]
                : musicalSections.slice(0, newNumberOfMusicalSections)
            );
          }}
        />
      </StyledLabel>
    </>
  );
};

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 5px;
`;

const StyledInput = styled.input`
  width: 50px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSetNumberOfMusicalSections;
