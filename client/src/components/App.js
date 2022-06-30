import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { AppProvider } from './AppContext'; //Add the Context Provider to the entire application

import Header from './Header';
import Home from './Home';
import About from './About';
import MyUserInfo from './MyUserInfo';
import Projects from './Projects';
import Users from './Users';
import User from './User';
import Project from './Project';
import ToneRows from './ToneRows';

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
            <Route path='/about' element={<About />} />
            {/* <Route path='/comp2/:id' element={<Comp2 />} /> */}
            <Route path='/projects' element={<Projects />} />
            <Route path='/users' element={<Users />} />
            <Route path='/tonerows' element={<ToneRows />} />
            <Route path='/users/:lowercaseusername' element={<User />} />
            <Route path='/projects/:projectid' element={<Project />} />
            <Route path='/myprojects/:projectid' element={<Project />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
