import React from 'react';
import Sidenav from '../dashboard/_components/SideNav';
import Header from '../dashboard/_components/Header';

function Layout({ children }) {
  return (
    <div>
      <div className="md:w-64 fixed hidden md:block">
        <Sidenav />
      </div>

      <div className="md:ml-64">
        <Header/>
        
        {children}</div>
    </div>
  );
}

export default Layout;
