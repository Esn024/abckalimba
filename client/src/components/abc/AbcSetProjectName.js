import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetProjectName = () => {
  const { projectName, setProjectName } = useContext(AppContext);

  //TODO not perfect, but it's a start
  const projectNameRegex = /^[-a-zA-Z!_:;/0-9 ]*$/;

  return (
    <>
      <Text>Project Name:</Text>
      <StyledLabel>
        <StyledInput
          type='text'
          id='projectName'
          value={projectName}
          pattern={projectNameRegex}
          onChange={(e) => {
            const newProjectName = e.target.value;
            if (newProjectName.match(projectNameRegex)) {
              setProjectName(newProjectName);
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
  align-items: center;
`;

const StyledInput = styled.input`
  width: 250px;
  text-align: center;
  margin: 8px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-top: 8px;
`;

export default AbcSetProjectName;
