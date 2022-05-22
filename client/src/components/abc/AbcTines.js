import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcTines = () => {
  const { numberOfTines } = useContext(AppContext);

  //onClick - clickOnNoteButton(this)
  //id is keyboard letter
  //height depends on how low note is.
  //innerText is the ABC note

  return (
    <Tines>
      <Tine
        className='tine'
        id='a'
        onClick='clickOnNoteButton(this)'
        style={{ height: '80px' }}
      >
        a
      </Tine>
      <Tine
        className='tine'
        id='w'
        onClick='clickOnNoteButton(this)'
        style={{ height: '62px' }}
      >
        c'
      </Tine>
      <Tine
        className='tine'
        id='s'
        onClick='clickOnNoteButton(this)'
        style={{ height: '94px' }}
      >
        c
      </Tine>
      <Tine
        className='tine'
        id='e'
        onClick='clickOnNoteButton(this)'
        style={{ height: '65px' }}
      >
        a
      </Tine>
      <Tine
        className='tine'
        id='d'
        onClick='clickOnNoteButton(this)'
        style={{ height: '125px' }}
      >
        A
      </Tine>
      <Tine
        className='tine'
        id='r'
        onClick='clickOnNoteButton(this)'
        style={{ height: '65px' }}
      >
        f
      </Tine>
      <Tine
        className='tine'
        id='f'
        onClick='clickOnNoteButton(this)'
        style={{ height: '95px' }}
      >
        e
      </Tine>
      <Tine
        className='tine'
        id='t'
        onClick='clickOnNoteButton(this)'
        style={{ height: '60px' }}
      >
        e'
      </Tine>
      <Tine
        className='tine'
        id='g'
        onClick='clickOnNoteButton(this)'
        style={{ height: '80px' }}
      >
        b
      </Tine>
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
