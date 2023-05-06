import { useState } from "react";
import Header from "./header/Header";
import SiderBar from "./siderBar/SiderBar";
// import SiderBarMobile from "./siderBar/SiderBarMobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  console.log(showMobile, isOpen);
  return (
    <>
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
      {/* <SiderBarMobile showMobile={showMobile} setShowMobile={setShowMobile} /> */}
      <div
        className={`${
          isOpen ? "pl-[250px]" : "pl-[65px]"
        } duration-300 min-h-screen`}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
