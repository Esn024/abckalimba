import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcThumbOneOrTwo = () => {
  return (
    <>
      <Text>Please select what your click will mean:</Text>
      <input
        type='radio'
        id='left'
        className='rest-left-right'
        value='1'
        checked
        onClick='changeLeftOrRight()'
      />
      <label for='left'>Left thumb</label>
      <br />
      <input
        type='radio'
        id='right'
        className='rest-left-right'
        value='2'
        onClick='changeLeftOrRight()'
      />
      <label for='right'>Right thumb</label>
    </>
  );
};

const StyledLabel = styled.label`
  display: flex;
  justify-content: center;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
`;

export default AbcThumbOneOrTwo;
