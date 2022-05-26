import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfMusicalSections = () => {
  const { musicalSections, setMusicalSections, beatsPerMeasure, tines } =
    useContext(AppContext);
  const [numberOfMusicalSections, setNumberOfMusicalSections] = useState(1);

  return (
    <>
      <StyledLabel>
        <Text>Musical Sections:</Text>
        <StyledInput
          type='number'
          id='quantity'
          name='quantity'
          min='1'
          max='26'
          value={numberOfMusicalSections}
          onChange={(e) => {
            setNumberOfMusicalSections(e.target.value);
            //if new # of musical sections is longer than previous one, keep previous data & add the right number of empty values; if shorter, remove some
            setMusicalSections(
              e.target.value > musicalSections.length
                ? [
                    ...musicalSections,
                    ...Array.from({
                      length: e.target.value - musicalSections.length,
                    }).map((el) => ({
                      // make sure that each the 1st musical section is "A", the 2nd "B" and so on
                      letterId: `${String.fromCharCode(
                        e.target.value * 1 + 64
                      )}`,
                      description: '',
                      numberOfMeasures: 1,
                      // create a musicalGridArray 1 measure long, with as many columns as tines and as many rows as the # of beats per measure
                      musicalGridArray: [
                        Array(beatsPerMeasure)
                          .fill(0)
                          .map((row) => new Array(tines.length).fill(0)),
                      ],
                    })),
                  ]
                : musicalSections.slice(0, e.target.value)
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
