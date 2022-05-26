import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfMeasuresInSection = ({
  numberOfMeasures,
  currentMusicalSectionIndex,
}) => {
  const {
    musicalSections,
    setMusicalSections,
    beatsPerMeasure,
    tines,
    replaceOneValueInArray,
  } = useContext(AppContext);

  const currentMusicalGridArray =
    musicalSections[currentMusicalSectionIndex].musicalGridArray;

  return (
    <>
      <StyledLabel>
        <Text># of Measures:</Text>
        <StyledInput
          type='number'
          min='1'
          max='100'
          value={numberOfMeasures}
          onChange={(e) =>
            setMusicalSections(
              replaceOneValueInArray(
                {
                  ...musicalSections[currentMusicalSectionIndex],
                  numberOfMeasures: e.target.value,
                  //if new # of measures is longer than before, keep previous data & add the right number of empty values; if shorter, remove some
                  musicalGridArray:
                    e.target.value > currentMusicalGridArray.length
                      ? [
                          // keep the previous existing measures
                          ...currentMusicalGridArray,
                          // add the required new # of measures, with as many columns as tines and as many rows as the # of beats per measure
                          ...Array.from({
                            length:
                              e.target.value - currentMusicalGridArray.length,
                          }).map((measure) =>
                            new Array(beatsPerMeasure)
                              .fill(0)
                              .map((row) => new Array(tines.length).fill(0))
                          ),
                        ]
                      : currentMusicalGridArray.slice(0, e.target.value),
                },
                currentMusicalSectionIndex,
                musicalSections
              )
            )
          }
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

export default AbcSetNumberOfMeasuresInSection;
