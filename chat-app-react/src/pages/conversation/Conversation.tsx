import { FC, MouseEventHandler, ReactNode, useState } from "react";

import Layout from "../../components/layout/Layout";
import "./conversation.scss";
import ConversationContent from "../../components/message/ConversationContent";
import { Link, Route, Routes } from "react-router-dom";
import useInnerWidth from "../../hooks/useInnterWidth";
import ConversationList from "../../components/message/ConversationList";
import ConversationSetting from "../../components/message/ConversationSetting";

export interface IPropButtonRounded {
  icon: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  to?: string;
}

const Conversation = () => {
  const [showMoreConversation, setShowMoreConversation] = useState(false);
  const innerWitdh = useInnerWidth();

  return (
    <Layout>
      <div className='relative md:grid md:grid-cols-12 flex w-full h-full overflow-hidden'>
        {innerWitdh < 640 ? (
          <Routes>
            <Route path='/' element={<ConversationList to={true} />} />
            <Route path='/1' element={<ConversationContent />} />
            <Route path='/setting' element={<ConversationSetting />} />
          </Routes>
        ) : (
          <>
            <ConversationList />
            <ConversationContent
              setShowMoreConversation={setShowMoreConversation}
              showMoreConversation={showMoreConversation}
            />
            <ConversationSetting
              showMoreConversation={showMoreConversation}
              setShowMoreConversation={setShowMoreConversation}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export const ButtonRounded: FC<IPropButtonRounded> = ({
  icon,
  className,
  onClick,
  to,
}) => {
  return (
    <Link
      to={to ? to : "#"}
      className={`${className} flex items-center justify-center text-[22px] p-2 bg-[#f1f3f4] rounded-full cursor-pointer`}
      onClick={onClick ? onClick : undefined}
    >
      {icon}
    </Link>
  );
};

export default Conversation;
