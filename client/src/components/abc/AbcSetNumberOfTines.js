import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetNumberOfTines = () => {
  // const [numberOfTines, setNumberOfTines] = useState();
  const { numberOfTines, setNumberOfTines, tines, setTines } =
    useContext(AppContext);

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
          onChange={(e) => setNumberOfTines(e.target.value)}
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
