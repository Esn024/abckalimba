import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetTempo = () => {
  const { tempo, setTempo } = useContext(AppContext);

  return (
    <>
      <StyledLabel>
        <Text title='Change the speed of the music playback, in beats per minute (one beat = one row in the note grid, or one eigth note in the sheet music).'>
          Tempo:
        </Text>
        <StyledInput
          type='number'
          id='tempo'
          min='1'
          max='500'
          value={tempo}
          onChange={(e) => {
            const newTempo = e.target.value * 1;
            setTempo(newTempo);
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

export default AbcSetTempo;
