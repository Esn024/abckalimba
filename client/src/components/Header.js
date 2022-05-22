import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppContext';
import { NavLink } from 'react-router-dom';
import useCurrentUser from '../hooks/use-current-user.hook.js';

const Header = () => {
  const { userId } = useContext(AppContext);
  const [currentUser] =
    useCurrentUser(userId); /* Return user details from API call */

  return (
    <HeaderElement>
      <Link to='/'>
        <h1>abcKalimbaSynth</h1>
      </Link>
      {currentUser ? (
        <div>
          Welcome, <Link to='/myuserinfo'>{currentUser.username}</Link>!
        </div>
      ) : (
        <div>
          <Link to='/registration'>Register for a new account!</Link>
        </div>
      )}
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

const Link = styled(NavLink)`
  text-decoration: none;
  color: var(--color-alabama-crimson);
`;

export default Header;
