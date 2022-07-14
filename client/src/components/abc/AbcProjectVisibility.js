import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcProjectVisibility = () => {
  const { projectVisibility, setProjectVisibility } = useContext(AppContext);
  return (
    <Wrapper>
      <Text title='Select whether you want your project to be visible to everyone who visits the website, or just to you (your private projects are listed in your user info page). This setting can be changed at any time.'>
        Project Visibility:
      </Text>
      <StyledInput
        type='radio'
        id='visibilityPublic'
        name='visibility'
        value='public'
        checked={projectVisibility === 'public'}
        onClick={() => setProjectVisibility('public')}
        readOnly
      />
      <StyledLabel htmlFor='public'>Public</StyledLabel>
      <StyledInput
        type='radio'
        id='visibilityPrivate'
        name='visibility'
        value='private'
        checked={projectVisibility === 'private'}
        onClick={() => setProjectVisibility('private')}
        readOnly
      />
      <StyledLabel htmlFor='visibilityPrivate'>Private</StyledLabel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
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
