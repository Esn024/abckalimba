import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';

import { AppContext } from './AppContext';

const About = () => {
  return (
    <Wrapper>
      <h1>About</h1>
      <p>
        abcKalimba is a musical tool that can be used for education and
        note-taking by players of tine-based instruments such as the Kalimba
        (thumb piano) or Marimba.
      </p>
      <p>
        You can select different tunings, create patterns, combine the patterns
        in different ways, export the results into either note grids or sheet
        music, and save your music as either a public project (visible to all)
        or a private one (visible to just you).
      </p>
      <p>
        If anything is unclear, you can hover your mouse for a few seconds over
        a setting description, and a more detailed explanation will pop up.
      </p>
      <p>
        To enter the names of the notes, use{' '}
        <a href='https://abcnotation.com/wiki/abc:standard:v2.1'>
          ABC notation
        </a>
        . Basically, write "c" for middle C (C4 in scientific music notation),
        and "C" for the note an octave below. To go down octaves, add commas (C,
        C,, C,,, and so on); to go up, add single-quote marks (c' c'' c''' and
        so on). ^c is C-sharp, and _c is C-flat.
      </p>
      <p>
        The source code for this website can be found{' '}
        <a href='https://github.com/Esn024/abc-kalimba-synth'>on GitHub</a>. In
        the background, this site uses Paul Rosen's{' '}
        <a href='https://paulrosen.github.io/abcjs/'>ABCJS</a>.
      </p>
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px auto;
  height: 660px;
  max-width: 550px;

  p {
    margin: 20px 0 0 0;
    margin-left: 0;
  }
`;

const StyledTable = styled.table`
  margin: 20px 0 0 0;
  td {
    padding: 0 10px;
  }

  th {
    padding: 0 10px 10px 10px;
  }
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: var(--color-alabama-crimson);
`;

export default About;
