//

import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Comp2 = () => {
  const { id } = useParams();
  return (
    <Wrapper>
      <Text>Test test, id: {id}!</Text>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  margin: 24px auto;
  height: 60px;
`;

const Text = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: 36px;
  text-align: center;
  margin: 12px 0 0 24px;
`;

export default Comp2;
