import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext';

const AbcSetOrderOfSections = () => {
  const { orderOfSections, setOrderOfSections, musicalSections } =
    useContext(AppContext);

  const arrayOfAllSectionLetters = musicalSections.map(
    (section) => section.letterId
  );
  const allSectionLettersStr = arrayOfAllSectionLetters.join('');

  //TODO not perfect, but it's a start
  const orderOfSectionsRegex = new RegExp(
    `([${allSectionLettersStr}]+([2-9]+[0-9]*)*|\([${allSectionLettersStr}]+\)([2-9]+[0-9]*))+`
  );
  // console.log({ orderOfSectionsRegex });
  // pattern={orderOfSectionsRegex}

  return (
    <>
      <StyledLabel>
        <Text title='Write the order in which the sections should be played. E.g. "AAABBB", which can also be written as "A3B3". Another example: "ABABCDEDE", aka. "(AB)2C(DE)2".'>
          Order of Sections:
        </Text>
        <StyledInput
          type='text'
          id='orderOfSections'
          value={orderOfSections}
          pattern={orderOfSectionsRegex}
          onChange={(e) => {
            const newOrderOfSections = e.target.value;
            if (newOrderOfSections.match(orderOfSectionsRegex)) {
              // console.log('matches', orderOfSectionsRegex);
            } else {
              // console.log('no match', orderOfSectionsRegex);
            }
            setOrderOfSections(newOrderOfSections);
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
  width: 50px;
`;

const Text = styled.p`
  font-size: var(--font-size-small);
  color: black;
  margin-right: 8px;
`;

export default AbcSetOrderOfSections;
