import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSelectThumb = () => {
  const { thumbOneOrTwo, setThumbOneOrTwo } = useContext(AppContext);
  return (
    <Wrapper>
      <Text>Hand (left or right):</Text>
      <StyledInput
        type='radio'
        id='left'
        name='rest-left-right'
        value='1'
        defaultChecked={thumbOneOrTwo === 1}
        onClick={() => setThumbOneOrTwo(1)}
      />
      <StyledLabel htmlFor='left'>1</StyledLabel>
      <StyledInput
        type='radio'
        id='right'
        name='rest-left-right'
        value='2'
        defaultChecked={thumbOneOrTwo === 2}
        onClick={() => setThumbOneOrTwo(2)}
      />
      <StyledLabel htmlFor='right'>2</StyledLabel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: var(--font-size-small);
`;

const StyledLabel = styled.label`
  font-size: var(--font-size-small);
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSelectThumb;
