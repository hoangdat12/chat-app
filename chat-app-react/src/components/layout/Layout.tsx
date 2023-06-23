import { useState } from 'react';
import Header from './header/Header';
import SiderBar from './siderBar/SiderBar';
// import SiderBarMobile from "./siderBar/SiderBarMobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  return (
    <>
      <div
        className={`${
          isOpen ? 'md:pl-[250px]' : 'md:pl-[65px]'
        } duration-300 h-screen pt-[76px]`}
      >
        {children}
      </div>
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setShowMobile={setShowMobile}
        showMobile={showMobile}
      />
      <SiderBar
        isOpen={isOpen}
        setShowMobile={setShowMobile}
        showMobile={showMobile}
      />
    </>
  );
};

export default Layout;
