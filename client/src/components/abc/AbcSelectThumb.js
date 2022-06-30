import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSelectThumb = () => {
  const { thumbOneOrTwo, setThumbOneOrTwo } = useContext(AppContext);
  return (
    <Wrapper>
      <Text title='Select which hand the notes you click on will be played by. This affects whether the colour of the note in the notegrid will be black or red, and whether the noteheads in the sheet music will point up or down. Although this is optional (you can just keep it on one setting if you want), it is easier to read music from the notation or note grid if this information is included.'>
        Hand (left or right):
      </Text>
      <StyledInput
        type='radio'
        id='left'
        name='rest-left-right'
        value='1'
        defaultChecked={thumbOneOrTwo === 1}
        onClick={() => setThumbOneOrTwo(1)}
      />
      <StyledLabel style={{ color: 'black' }} htmlFor='left'>
        1
      </StyledLabel>
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
  color: var(--color-cadmium-red);
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSelectThumb;
