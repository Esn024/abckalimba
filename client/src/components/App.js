import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { AppProvider } from './AppContext'; //Add the Context Provider to the entire application

import Header from './Header';
import Home from './Home';
import MyUserInfo from './MyUserInfo';
import Comp2 from './Comp2';
import PublicProjects from './PublicProjects';
import Users from './Users';
import User from './User';
import ToneRows from './ToneRows';
//

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <AppProvider>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/registration' element={<MyUserInfo />} />
            <Route path='/myuserinfo' element={<MyUserInfo />} />
            <Route path='/comp2/:id' element={<Comp2 />} />
            <Route path='/projects' element={<PublicProjects />} />
            <Route path='/users' element={<Users />} />
            <Route path='/tonerows' element={<ToneRows />} />
            <Route path='/user/:lowercaseusername' element={<User />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
