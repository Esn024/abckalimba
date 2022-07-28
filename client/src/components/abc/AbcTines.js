import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

import AbcTine from './AbcTine';

const AbcTines = () => {
  const { tines, setTines } = useContext(AppContext);

  //onClick - clickOnNoteButton(this)
  //id is keyboard letter
  //height depends on how low note is.
  //innerText is the ABC note

  // console.log({ tines });
  return (
    <Tines>
      {tines &&
        tines.map((tine, index) => (
          <VWrapper key={`tineWrapper-${index}`}>
            <SelectTineBrightness
              key={`select-tine-color-${index}`}
              title='Click to change the color of the note (this can make it easier to keep track of where you are on the instrument)'
              onClick={() => {
                // console.log({ index });
                let newTines = [...tines];
                newTines[index].color = newTines[index].color === 0 ? 1 : 0;
                // console.log(newTines[index].color);
                console.log(tines[index]);

                setTines(newTines);
              }}
            >
              {tine.color ? '●' : '○'}
            </SelectTineBrightness>
            <AbcTine
              abcNote={tine.abcNote}
              keyboardLetter={tine.keyboardLetter}
              cents={tine.cents}
              color={tine.color || 0}
              tineIndex={index}
              key={index}
            />
          </VWrapper>
        ))}
    </Tines>
  );
};

const VWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SelectTineBrightness = styled.button`
  border: 0;
  background: none;
  color: black;
`;

const Tines = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;

  margin: 0 8px 8px 8px;
`;

export default AbcTines;
