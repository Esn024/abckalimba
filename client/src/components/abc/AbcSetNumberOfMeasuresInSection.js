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

  return (
    <>
      <StyledLabel>
        <Text># of Measures:</Text>
        <StyledInput
          type='number'
          min='1'
          max='100'
          value={numberOfMeasures}
          onChange={
            (e) => {
              const currentMeasures =
                musicalSections[currentMusicalSectionIndex].measures;
              const newNumberOfMeasures = e.target.value * 1;
              const measuresHaveBeenAdded =
                newNumberOfMeasures > numberOfMeasures;
              const numberOfNewMeasuresAdded =
                newNumberOfMeasures - numberOfMeasures;
              const numberOfTines = tines.length;

              console.log({
                currentMeasures,
                newNumberOfMeasures,
                measuresHaveBeenAdded,
                numberOfNewMeasuresAdded,
                numberOfTines,
                beatsPerMeasure,
              });
              // change current musicalSection (add or remove the right number of measures)
              let modifiedMusicalSections = [];
              let modifiedMeasures = [];

              modifiedMeasures = measuresHaveBeenAdded
                ? [
                    ...currentMeasures,
                    ...Array(numberOfNewMeasuresAdded)
                      .fill(0)
                      .map((measure) =>
                        // Array.from(
                        //   Array(beatsPerMeasure),
                        //   () => new Array(numberOfTines)
                        // )
                        Array(beatsPerMeasure)
                          .fill(null)
                          .map((beatRow) => Array(numberOfTines).fill(0))
                      ),
                  ]
                : currentMeasures.slice(0, newNumberOfMeasures);

              // finally, update state with the modified object
              modifiedMusicalSections = [...musicalSections];

              modifiedMusicalSections[currentMusicalSectionIndex].measures =
                modifiedMeasures;

              modifiedMusicalSections[
                currentMusicalSectionIndex
              ].numberOfMeasures = newNumberOfMeasures;

              setMusicalSections(modifiedMusicalSections);
            }
            // setMusicalSections(
            //   replaceOneValueInArray(
            //     {
            //       ...musicalSections[currentMusicalSectionIndex],
            //       numberOfMeasures: e.target.value,
            //       //if new # of measures is longer than before, keep previous data & add the right number of empty values; if shorter, remove some
            //       measures:
            //         e.target.value > currentMeasures.length
            //           ? [
            //               // keep the previous existing measures
            //               ...currentMeasures,
            //               // add the required new # of measures, with as many columns as tines and as many rows as the # of beats per measure
            //               ...Array.from({
            //                 length: e.target.value - currentMeasures.length,
            //               }).map((measure) =>
            //                 new Array(beatsPerMeasure)
            //                   .fill(0)
            //                   .map((row) => new Array(tines.length).fill(0))
            //               ),
            //             ]
            //           : currentMeasures.slice(0, e.target.value),
            //     },
            //     currentMusicalSectionIndex,
            //     musicalSections
            //   )
            // )
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
