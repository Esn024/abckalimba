import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfTines = () => {
  const [numberOfTines, setNumberOfTines] = useState(4);
  const { tines, setTines } = useContext(AppContext);

  return (
    <>
      <StyledLabel>
        <Text>Select Number of Tines:</Text>
        <StyledInput
          type='number'
          id='quantity'
          name='quantity'
          min='3'
          max='21'
          value={numberOfTines}
          onChange={(e) => {
            setNumberOfTines(e.target.value);
            //if new # of tines is longer than previous one, keep previous data & add the right number of empty values; if shorter, remove some
            setTines(
              e.target.value > tines.length
                ? [
                    ...tines,
                    ...Array.from({
                      length: e.target.value - tines.length,
                    }).map(() => ({
                      keyboardLetter: '',
                      abcNote: '',
                      cents: 0,
                    })),
                  ]
                : tines.slice(0, e.target.value)
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

export default AbcSetNumberOfTines;
