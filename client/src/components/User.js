import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import useOtherUser from '../hooks/use-other-user.hook.js';

import Projects from './Projects';

const User = () => {
  const { lowercaseusername } = useParams();

  const [otherUser, setOtherUser] = useOtherUser(lowercaseusername);

  return (
    <Wrapper>
      <h1>{otherUser && otherUser.username}</h1>
      <About>{otherUser && otherUser.about}</About>
      <Projects userId={null} username={lowercaseusername} />
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
`;

const About = styled.div`
  margin: 20px 0;
`;

export default User;
