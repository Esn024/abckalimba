import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppContext';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useContext(AppContext);
  return (
    <HeaderElement>
      <Link to='/'>
        <h1>abcKalimbaSynth</h1>
      </Link>
      <HorizontalWrapper>
        <SiteLinks>
          <Link to='/users'>Users</Link>
          <Link to='/projects'>Projects</Link>
          <Link to='/tonerows'>Rows</Link>
        </SiteLinks>
        {currentUser ? (
          <SmallerText>
            Welcome, <Link to='/myuserinfo'>{currentUser.username}</Link>!
          </SmallerText>
        ) : (
          <div>
            <Link to='/registration'>Register for a new account!</Link>
          </div>
        )}
      </HorizontalWrapper>
    </HeaderElement>
  );
};

const HeaderElement = styled.header`
  background: white;
  border-bottom: 4px dotted black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  display: flex;
  /* max-width: 1280px; */
  margin-left: auto;
  margin-right: auto;
  h1:hover {
    color: var(--color-orange)
    transition: all 0.2s;
  }
`;

const SmallerText = styled.p`
  font-size: var(--font-size-small);
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: var(--color-alabama-crimson);
`;

const HorizontalWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SiteLinks = styled.div`
  margin: 0 40px;
  a {
    margin: 0 10px;
  }
`;

export default Header;
