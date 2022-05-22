import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcKeyDefinitions = () => {
  const { numberOfTines, tines, setTines, replaceOneValueInArray } =
    useContext(AppContext);

  //create array of tines of the right length, with empty values
  setTines(
    Array.from({ length: numberOfTines }).map((x) => ({
      keyboardLetter: '',
      abcNote: '',
      cents: 0,
    }))
  );

  const tineLetterTriggerRegex = `/[a-z]/`;
  const abcNoteRegex = `[\^_]?[A-Ga-g][,']{0,4}`;
  const abcCentRegex = `[-]?[0-9]{1,3}\.?[0-9]{1,3}`;
  //replaceOneValueInArray
  return (
    <>
      <KeyDefinitions>
        {tines.map((tine, index) => {
          return (
            <div className='key-definition'>
              <LetterInput
                type='text'
                pattern={tineLetterTriggerRegex}
                maxlength='1'
                value={tine.keyboardLetter}
                onChange={(e) => {
                  //change the keyboard letter value in one tine of the tines array
                  const newLetterValue = e.target.value;
                  const newTine = { ...tine, keyboardLetter: newLetterValue };
                  setTines(replaceOneValueInArray(newTine, index, tines));
                }}
              />
              <DefInput
                id='w-input'
                type='text'
                pattern={abcNoteRegex}
                maxlength='6'
                size='4'
                value={tine.abcNote}
                onChange={(e) => {
                  //TODO changeTineInnerText

                  //change the abcNote value in one tine of the tines array
                  const newAbcNoteValue = e.target.value;
                  const newTine = { ...tine, abcNote: newAbcNoteValue };
                  setTines(replaceOneValueInArray(newTine, index, tines));
                }}
              />
              <br />
              <DefInput
                id='w-cents'
                type='text'
                pattern={abcCentRegex}
                value={tine.cents}
                size='4'
                onChange={(e) => {
                  //change the cents value in one tine of the tines array
                  const newCentsValue = e.target.value;
                  const newTine = { ...tine, cents: newCentsValue };
                  setTines(replaceOneValueInArray(newTine, index, tines));
                }}
              />
            </div>
          );
        })}
      </KeyDefinitions>
    </>
  );
};

const KeyDefinitions = styled.div`
  display: flex;
  justify-content: center;
`;

// const LetterDiv = styled.div`
//   margin-top: 10px;
//   text-align: center;
//   padding: 0;
// `;

const LetterInput = styled.input`
  width: 55px;
  height: 20px;
  border: 1px solid black;
  padding: 1px 2px;
  font-size: var(--font-size-small);
`;

const DefInput = styled.input`
  width: 55px;
  height: 20px;
  border: 1px solid black;
  padding: 1px 2px;
  font-size: var(--font-size-small);
`;

export default AbcKeyDefinitions;
