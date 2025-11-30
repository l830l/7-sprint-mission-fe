import { useChannelState } from "../../context/channel/ChannelStateContext";
import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import MessageBubble from "./MessageBubble";
import { preprocessMessages } from "../../utils/preprocess_message";
import { useUserState } from "../../context/user/UserStateContext";

const MessageListArea = ({ messageList }) => {
  const [messages, setMessages] = useState([]);
  const user = useUserState();

  const processedMessages = preprocessMessages(messageList);

  return (
    <div className="message-list-area">
      {processedMessages.length > 0 ? (
        processedMessages.map((msg) => (
          <div key={msg.messageId}>
            {msg.shouldShowDateLabel && (
              <div className="date-divider">
                <span className="txt">{msg.dateLabel}</span>
              </div>
            )}

            <MessageBubble message={msg} currentUser={user} />
          </div>
        ))
      ) : (
        <p className="no-content-txt">
          메시지가 없습니다. 첫 메세지를 입력해보세요!
        </p>
      )}
    </div>
  );
};

export default MessageListArea;
