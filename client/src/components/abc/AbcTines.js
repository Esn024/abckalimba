import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcTines = () => {
  const { tines, clickOnNoteButton } = useContext(AppContext);

  //onClick - clickOnNoteButton(this)
  //id is keyboard letter
  //height depends on how low note is.
  //innerText is the ABC note

  return (
    <Tines>
      {tines.map((tine) => (
        <Tine
          className='tine'
          id={tine.keyboardLetter}
          onClick={clickOnNoteButton(tine.keyboardLetter, tine.abcNote)}
          style={{ height: '80px' }}
        >
          {tine.abcNote}
        </Tine>
      ))}
    </Tines>
  );
};

const Tines = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Tine = styled.button`
  width: 30px;
  padding: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export default AbcTines;
