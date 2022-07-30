import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import abcjs from 'abcjs';
// import Abcjs from 'react-abcjs';
import { saveAsPng, saveAsJpeg } from 'save-html-as-image';
import Project from './Project.js';
import AbcTines from './abc/AbcTines.js';
import AbcSetNumberOfTines from './abc/AbcSetNumberOfTines';
import AbcSelectToneRow from './abc/AbcSelectToneRow';
import AbcKeyDefinitions from './abc/AbcKeyDefinitions.js';

import useProject from '../hooks/use-project.hook.js';

import AbcSetBeatsPerMeasure from './abc/AbcSetBeatsPerMeasure';
import AbcSetTempo from './abc/AbcSetTempo';
import AbcSetOrderOfSections from './abc/AbcSetOrderOfSections';
import AbcSetKey from './abc/AbcSetKey';
import AbcSelectTune from './abc/AbcSelectTune.js';
import AbcSelectThumb from './abc/AbcSelectThumb.js';
import AbcSetNumberOfMusicalSections from './abc/AbcSetNumberOfMusicalSections.js';
import AbcMusicalSection from './abc/AbcMusicalSection.js';

import AbcNoteGrid from './abc/AbcNoteGrid.js';
import AbcFinalPiece from './abc/AbcFinalPiece.js';
import AbcSetProjectName from './abc/AbcSetProjectName.js';
import AbcDescription from './abc/AbcDescription.js';
import AbcProjectVisibility from './abc/AbcProjectVisibility.js';

//AbcThumbOneOrTwo

import { AppContext } from './AppContext';

const Home = () => {
  return <Project />;
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px auto;
  height: 660px;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProjectName = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-big);
  text-align: center;
  margin: 8px;
`;

const Description = styled.p`
  color: black;
  font-family: var(--font-heading);
  font-size: var(--font-size-smaller);
  text-align: left;
  margin-bottom: 12px;
`;

const StyledButton = styled.button`
  font-size: var(--font-size-smaller);
  margin: 10px;
`;

const StyledButton2 = styled(StyledButton)`
  font-size: var(--font-size-small);
  margin: 10px 0 0 0;
`;

export default Home;
