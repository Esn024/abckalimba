import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetKey = () => {
  const { key, setKey } = useContext(AppContext);

  return (
    <StyledLabel>
      <datalist id='keys'>
        <option value='C#'>7 ♯ (C#/A#m)</option>
        <option value='F#'>6 ♯ (F#/D#m)</option>
        <option value='B'>5 ♯ (B/G#m)</option>
        <option value='E'>4 ♯ (E/C#m)</option>
        <option value='A'>3 ♯ (A/F#m)</option>
        <option value='D'>2 ♯ (D/Bm)</option>
        <option value='G'>1 ♯ (G/Em)</option>
        <option value='C'>0 ♯/♭ (C/Am)</option>
        <option value='F'>1 ♭ (F/Dm)</option>
        <option value='Bb'>2 ♭ (Bb/Gm)</option>
        <option value='Eb'>3 ♭ (Eb/Cm)</option>
        <option value='Ab'>4 ♭ (Ab/Fm)</option>
        <option value='Db'>5 ♭ (Db/Bbm)</option>
        <option value='Gb'>6 ♭ (Gb/Ebm)</option>
        <option value='Cb'>7 ♭ (Cb/Abm)</option>
      </datalist>
      <Text title='Select from the existing choices or type in your own (must be a valid "K:" field based on the abc notation standard v2.1)'>
        Key:
      </Text>
      <StyledInput
        list='keys'
        type='text'
        id='key'
        value={key}
        onChange={(e) => {
          const newKey = e.target.value;
          setKey(newKey);
        }}
      />
    </StyledLabel>
  );
};

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 50px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSetKey;
