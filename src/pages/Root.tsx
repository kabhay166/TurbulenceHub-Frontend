import SideBar from '@/components/SideBar';
import NavBar from '../components/NavBar'
import { Outlet } from '@tanstack/react-router'
import { useState } from 'react';
import useUserStore from '@/globals/userStore';
import HamburgerNavBar from '@/components/HamburgerNavBar';
import HamburgerSidebar from '@/components/HamburgerSideBar';


export default function Root() {
  const [showSidebar,setShowSidebar] = useState<boolean|null>(null);
  const [showHamburgerSidebar,setShowHamburgerSidebar] = useState<boolean|null>(null);
  const userStore = useUserStore();

  

  function closeSidebar() {
    setShowSidebar(false)
  }

  function closeHamburgerSidebar() {
    setShowHamburgerSidebar(false)
  }

  function toggleSidebar() {
    setShowSidebar((showSidebar) => !showSidebar);
  }

  function toggleHamburgerSidebar() {
    setShowHamburgerSidebar((showHamburgerSidebar) => !showHamburgerSidebar);
  }

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar}/>
      <HamburgerNavBar isOpen={showHamburgerSidebar == true ? true : false} toggleSidebar={toggleHamburgerSidebar} />
      <HamburgerSidebar show={showHamburgerSidebar} closeSidebar={closeHamburgerSidebar} />
      { ( userStore.user.username && showSidebar !== null ) &&
      <SideBar show={showSidebar} closeSidebar={closeSidebar}/>
      }
      <Outlet />
    </>
  );
}
