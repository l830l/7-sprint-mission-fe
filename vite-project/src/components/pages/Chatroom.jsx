import { useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import ChannelProvider from "../../context/channel/ChannelProvider";
import ChatContent from "../chat/ChatContent";
import { UserProvider } from "../../context/user/UserProvider";

const Chatroom = () => {
  const [isOpenSide, setIsOpenSide] = useState(true);

  return (
    <>
      <UserProvider>
        <ChannelProvider>
          <div className={`content-wrap ${isOpenSide ? "open" : ""}`}>
            <Header isOpen={isOpenSide} setIsOpen={setIsOpenSide} />
            <Sidebar />
            <ChatContent />
          </div>
        </ChannelProvider>
      </UserProvider>
    </>
  );
};

export default Chatroom;
