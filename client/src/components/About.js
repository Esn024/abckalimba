import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink, useParams } from 'react-router-dom';

import { AppContext } from './AppContext';

const About = () => {
  return (
    <Wrapper>
      <h1>About</h1>
      <p>
        abcKalimbaSynth is a musical tool that can be used for education and
        note-taking by players of tine-based instruments such as the Kalimba
        (thumb piano) or Marimba.
      </p>
      <p>
        You can select different tunings, create patterns, combine the patterns
        in different ways, export the results into either note grids or sheet
        music, and save your music as either a public project (visible to all)
        or a private one (visible to just you).
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
