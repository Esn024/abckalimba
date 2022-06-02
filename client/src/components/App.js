import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { AppProvider } from './AppContext'; //Add the Context Provider to the entire application

import Header from './Header';
import Home from './Home';
import MyUserInfo from './MyUserInfo';
import Comp2 from './Comp2';

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
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
