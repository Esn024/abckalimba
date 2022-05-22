import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcKeyDefinitions = () => {
  const abcNoteRegex = `[\^_]?[A-Ga-g][,']{0,4}`;
  const abcCentRegex = `[-]?[0-9]{1,3}\.?[0-9]{1,3}`;

  return (
    <>
      <KeyDefinitions>
        <div className='key-definition'>
          <LetterDiv>W</LetterDiv>
          <DefInput
            id='w-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='w-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>E</LetterDiv>
          <DefInput
            id='e-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='e-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>R</LetterDiv>
          <DefInput
            id='r-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='r-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>T</LetterDiv>
          <DefInput
            id='t-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='t-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
      </KeyDefinitions>

      <KeyDefinitions>
        <div className='key-definition'>
          <LetterDiv>A</LetterDiv>
          <DefInput
            id='a-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            title='Name of note that should be played with this letter, in ABC notation'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='a-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
            title='Cents by which to detune this note, if any (from -100 to 100)'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>S</LetterDiv>
          <DefInput
            id='s-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='s-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>D</LetterDiv>
          <DefInput
            id='d-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='d-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>F</LetterDiv>
          <DefInput
            id='f-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='f-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
        <div className='key-definition'>
          <LetterDiv>G</LetterDiv>
          <DefInput
            id='g-input'
            type='text'
            pattern={abcNoteRegex}
            maxlength='6'
            size='4'
            onChange='changeTineInnerText(this)'
          />
          <br />
          <DefInput
            id='g-cents'
            type='text'
            pattern={abcCentRegex}
            value='0'
            size='4'
          />
        </div>
      </KeyDefinitions>
    </>
  );
};

const KeyDefinitions = styled.div`
  display: flex;
  justify-content: center;
`;

const LetterDiv = styled.div`
  margin-top: 10px;
  text-align: center;
  padding: 0;
`;

const DefInput = styled.input`
  width: 55px;
  height: 20px;
  border: 1px solid black;
  padding: 1px 2px;
  font-size: var(--font-size-small);
`;

export default AbcKeyDefinitions;
