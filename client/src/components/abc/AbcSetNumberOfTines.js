import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfTines = () => {
  const [numberOfTines, setNumberOfTines] = useState(4);
  const {
    tines,
    setTines,
    musicalSections,
    setMusicalSections,
    updateTinesAfterTineNumberChange,
    updateMusicalSectionsAfterTineNumberChange,
  } = useContext(AppContext);

  // update numberOfTines & musicalSections if the tines are updated
  useEffect(() => {
    setNumberOfTines(tines.length);
    updateMusicalSectionsAfterTineNumberChange(
      tines.length,
      tines,
      musicalSections,
      setMusicalSections
    );
  }, [tines]);

  return (
    <>
      <StyledLabel>
        <Text>Modify Number of Tones:</Text>
        <StyledInput
          type='number'
          id='quantity'
          name='quantity'
          min='3'
          max='21'
          value={numberOfTines}
          onChange={(e) => {
            const newNumberOfTines = e.target.value * 1;

            if (tines.length !== newNumberOfTines) {
              setNumberOfTines(newNumberOfTines);

              updateMusicalSectionsAfterTineNumberChange(
                newNumberOfTines,
                tines,
                musicalSections,
                setMusicalSections
              );

              updateTinesAfterTineNumberChange(
                newNumberOfTines,
                tines,
                setTines
              );
            }
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
