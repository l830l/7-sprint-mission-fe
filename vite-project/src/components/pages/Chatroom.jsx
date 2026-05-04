import { useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import ChannelProvider from "../../context/channel/ChannelProvider";
import ChatContent from "../chat/ChatContent";

const Chatroom = () => {
  const [isOpenSide, setIsOpenSide] = useState(true);

  return (
    <>
        <ChannelProvider>
          <div className={`content-wrap ${isOpenSide ? "open" : ""}`}>
            <Header isOpen={isOpenSide} setIsOpen={setIsOpenSide} />
            <Sidebar />
            <ChatContent />
          </div>
        </ChannelProvider>
    </>
  );
};

export default Chatroom;
