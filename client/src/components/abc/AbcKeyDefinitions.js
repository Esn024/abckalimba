import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcKeyDefinitions = () => {
  const { tines, setTines, replaceOneValueInArray } = useContext(AppContext);

  // useEffect(() => {
  //   props.setAuthenticated(true);
  // }, []);

  //create array of tines of the right length, with empty values
  // setTines(
  //   Array.from({ length: 7 }).map((x) => ({
  //     keyboardLetter: '',
  //     abcNote: '',
  //     cents: 0,
  //   }))
  // );
  // setTines(Array.from({ length: numberOfTines }));

  const tineLetterTriggerRegex = /[a-z]/;
  const abcNoteRegex = /[\^_]?[A-Ga-g][,']{0,4}/;
  const abcCentRegex = /[-]?[0-9]{1,3}\.?[0-9]{1,3}/;
  //replaceOneValueInArray
  return (
    <KeyDefinitions>
      <DefDescriptions>
        <DefDescription>Keyboard Keys:</DefDescription>
        <DefDescription>Musical Tones:</DefDescription>
        <DefDescription>Tuning (in cents):</DefDescription>
      </DefDescriptions>
      {tines &&
        tines.map((tine, index) => {
          return (
            <div className='key-definition' key={'tine-defitition-' + index}>
              <DefInput
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
              <br />
              <DefInput
                id={'w-abcNote-' + index}
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
                id={'w-cents-' + index}
                type='text'
                pattern={abcCentRegex}
                value={tine.cents}
                size='4'
                onChange={(e) => {
                  //change the cents value in one tine of the tines array
                  const newCentsValue = e.target.value * 1;
                  const newTine = { ...tine, cents: newCentsValue };
                  setTines(replaceOneValueInArray(newTine, index, tines));
                }}
              />
            </div>
          );
        })}
    </KeyDefinitions>
  );
};

const KeyDefinitions = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin: 10px;
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
  width: 40px;
  height: 20px;
  border: 1px solid black;
  padding: 1px 2px;
  font-size: var(--font-size-small);
`;

const DefDescription = styled.div`
  height: 24px;
  padding: 1px 2px;
  font-size: var(--font-size-small);
  text-align: right;
`;

const DefDescriptions = styled.div`
  position: absolute;
  left: -130px;
`;

export default AbcKeyDefinitions;
