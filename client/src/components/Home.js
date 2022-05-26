import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import abcjs from 'abcjs';
// import Abcjs from 'react-abcjs';
import AbcComponent from './abc/AbcComponent1.js';
import AbcSetNumberOfTines from './abc/AbcSetNumberOfTines';
import AbcKeyDefinitions from './abc/AbcKeyDefinitions.js';

import AbcSetBeatsPerMeasure from './abc/AbcSetBeatsPerMeasure';
import AbcSelectTune from './abc/AbcSelectTune.js';
import AbcSelectThumb from './abc/AbcSelectThumb.js';
import AbcSetNumberOfMusicalSections from './abc/AbcSetNumberOfMusicalSections.js';
import AbcMusicalSection from './abc/AbcMusicalSection.js';

import AbcTines from './abc/AbcTines.js';
import AbcNoteGrid from './abc/AbcNoteGrid.js';

//AbcThumbOneOrTwo

import { AppContext } from './AppContext';

const Home = () => {
  const { userId, musicalSections } = useContext(AppContext);

  const abc = `X:1
  T: Cooley's
  %%barnumbers 1
  M: 8/8
  L: 1/8
  Q: 1/4=200
  R: reel
  K: Emin
  EBBA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
  EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2 gf|
  |eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
  eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2 D2||`;

  const abc2 = `X:2
  T:Title
  C:Composer Name (yyyy)
  M:8/8
  Q:1/4=76
  L:1/8
  %%score (T1 T2)
  V:T1           clef=treble  name="Left thumb"   snm="L"
  V:T2           clef=treble  name="Right thumb"  snm="R"
  K:Gm
  %            End of header, start of tune body:
  % 1
  [V:T1]  zBzczdzg  | f6e2      | (d2c2 d2)e2 | d4 c2z2 |
  [V:T2]  GzAzBzez  | d6c2      | (B2A2 B2)c2 | B4 A2z2 |
  % 5
  [V:T1]  (B2c2 d2g2)  | f8        | d3c (d2fe)  | H d6    ||
  [V:T2]       z8      |     z8    | B3A (B2c2)  | H A6    ||`;

  const abc3 = `X:3
  T:Title
  C:Composer Name (yyyy)
  M:4/8
  Q:1/4=176
  L:1/8
  %%score (T1 T2)
  V:T1           clef=treble  name="Left Thumb"   snm="L"
  V:T2           clef=treble  name="Right Thumb"  snm="R"
  K:Gm
  %            End of header, start of tune body:
  % 1
  [V:T1]  C4| zGzB | zGzB | zGzB | zGzB |
  [V:T2]  zc3| FzGz | FzGz | FzGz | FzGz |
  % 5
  [V:T1]  zGzc | zGzc | zGzc | zGzc ||
  [V:T2]  FzGz | FzGz | FzGz | FzGz ||`;

  const abc4 = `X:4
  M:4/8
  L:1/8
  %%score (T1 T2)
  V:T1           clef=treble  name="Left Thumb"   snm="L"
  V:T2           clef=treble  name="Right Thumb"  snm="R"
  % 1
  [V:T1]  zdze | zdze | zdze | zdze | zdze | zdze | zdze | zdze |
  [V:T2]  czcz | czcz | czcz | czcz | czcz | czcz | czcz | czcz |
  `;

  let allAbcTunes = { abc, abc2, abc3, abc4 };

  //var midi = abcjs.synth.getMidiFile(visualObj[0], { midiOutputType: "encoded" });
  // const midi = abcjs.synth.getMidiFile(abc2, {
  //   chordsOff: true,
  //   midiOutputType: 'binary',
  //   bpm: 100,
  // });

  // console.log(midi);

  return (
    <Wrapper>
      <Text>ABC Test</Text>
      <AbcSetNumberOfTines />
      <AbcKeyDefinitions />
      <AbcSetBeatsPerMeasure />
      <AbcSetNumberOfMusicalSections />
      <AbcSelectThumb />
      {/* <AbcSelectTune /> */}
      {/* <AbcComponent abc={abc2} /> */}
      <AbcTines />
      {/* <AbcThumbOneOrTwo /> */}
      {musicalSections.map((e, i) => (
        <AbcMusicalSection key={i} />
      ))}
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px auto;
  height: 660px;
`;

const Text = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  text-align: center;
  margin: 12px 0 0 24px;
`;

export default Home;
