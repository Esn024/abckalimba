import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcProjectVisibility = () => {
  const { projectVisibility, setProjectVisibility } = useContext(AppContext);
  return (
    <Wrapper>
      <Text>Project Visibility:</Text>
      <StyledInput
        type='radio'
        id='visibilityPublic'
        name='visibility'
        value='public'
        defaultChecked={projectVisibility === 'public'}
        onClick={() => setProjectVisibility('public')}
      />
      <StyledLabel htmlFor='public'>Public</StyledLabel>
      <StyledInput
        type='radio'
        id='visibilityPrivate'
        name='visibility'
        value='private'
        defaultChecked={projectVisibility === 'private'}
        onClick={() => setProjectVisibility('private')}
      />
      <StyledLabel htmlFor='visibilityPrivate'>Private</StyledLabel>
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
  /* color: black; */
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcProjectVisibility;
