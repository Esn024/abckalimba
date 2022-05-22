import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import abcjs from 'abcjs';
// import Abcjs from 'react-abcjs';
import AbcComponent from './abc/AbcComponent1.js';

import { AppContext } from './AppContext';

const Home = () => {
  const { userId } = useContext(AppContext);
  // useEffect(() => {
  //   console.log({ midi });
  // }, [midi]);

  const abc1 = `T: Cooley's
    M: 4/4
    L: 1/8
    R: reel
    K: Emin
    |:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
    EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|
    |:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
    eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|`;

  const abc2 = `
  T: Example
  M: 4/4
  K: G
  |:Gccc dedB|dedB dedB|c2ec B2dB|c2A2 A2BA|`;

  //var midi = abcjs.synth.getMidiFile(visualObj[0], { midiOutputType: "encoded" });
  const midi = abcjs.synth.getMidiFile(abc2, {
    chordsOff: true,
    midiOutputType: 'binary',
    bpm: 100,
  });

  console.log(midi);

  return (
    <Wrapper>
      <Text>userID is {userId}</Text>
      <Text>ABC Test</Text>
      <AbcComponent abc={abc2} />
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  /* display: flex; */
  margin: 24px auto;
  height: 660px;
`;

const Text = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: 36px;
  text-align: center;
  margin: 12px 0 0 24px;
`;

export default Home;
