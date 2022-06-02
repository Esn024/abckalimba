import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcDescription = () => {
  const { projectDescription, setProjectDescription } = useContext(AppContext);

  const sanitizeDescriptionStr = (str) => {
    // allows all letters in any language, as well as most punctuation marks, but not <>
    // this isn't really that useful, will do more sanitizing on the backend
    return str.replace(/^[^-_+\/:;"'!@#$%^&*()?,\.=\p{L}0-9\s\n]*$/gu, '');
  };

  return (
    <>
      <P>Project description:</P>
      <Textarea
        id='projectDescription'
        value={projectDescription}
        onChange={(e) => {
          const newDescription = sanitizeDescriptionStr(e.target.value);
          setProjectDescription(newDescription);
        }}
      />
    </>
  );
};

const P = styled.p`
  margin-bottom: 8px;
`;
const Textarea = styled.textarea`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcDescription;
