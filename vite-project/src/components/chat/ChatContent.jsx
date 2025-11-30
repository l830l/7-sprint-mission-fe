import MessageListArea from "./MessageListArea";
import MessageInputArea from "./MessageInputArea";
import MemberList from "./MemberList";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { useEffect, useState } from "react";
import apiClient from "../../api/client";

const ChatContent = () => {
  const { selectedChannel } = useChannelState();
  const [messageList, setMessageList] = useState([]);

  const loadMessage = () => {
    apiClient
      .get("/api/messages", {
        params: { channelId: selectedChannel.channelId },
      })
      .then((res) => setMessageList(res?.data))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (!selectedChannel) return;
    loadMessage();
  }, [selectedChannel]);

  return (
    <>
      <div className="chat-content-area">
        <div className="message-content-area">
          <MessageListArea messageList={messageList} />
          <MessageInputArea loadMessage={loadMessage} />
        </div>
        {selectedChannel?.type === "private" ? (
          <div className="member-list-area">
            <MemberList />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ChatContent;
