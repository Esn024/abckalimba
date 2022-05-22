import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import { AppProvider } from './AppContext'; //Add the Context Provider to the entire application

import Home from './Home';
import Registration from './Registration';
import Comp2 from './Comp2';

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/comp2/:id' element={<Comp2 />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
