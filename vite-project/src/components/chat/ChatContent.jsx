import MessageListArea from "./MessageListArea";
import MessageInputArea from "./MessageInputArea";
import MemberList from "./MemberList";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { useEffect, useState, useRef } from "react";
import apiClient from "../../api/client";

const ChatContent = () => {
  const { selectedChannel } = useChannelState();
  const containerRef = useRef(null);
  const loadingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const initialScrollRef = useRef(false);
  

  const [messageList, setMessageList] = useState({
    content: [],
    hasNext: false,
    cursor: null,
    after: null,
    size: 50,
  });

  // 최초 로딩(채널 변경 시)
  const loadMessage = () => {
    initialScrollRef.current = true;
    
    apiClient
      .get("/api/messages", {
        params: { channelId: selectedChannel?.channelId },
        size: messageList.size,
      })
      .then((res) => {
        setMessageList(res?.data);
        // 최신 메시지가 아래로 오도록 스크롤 이동
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        });
      })
      .catch((err) => console.error(err));
  };

  // 위로 스크롤 -> 과거 메세지 로딩
  const loadNextMessages = () => {
    
    if (!messageList.hasNext || !messageList.cursor) return;
    if (loadingRef.current) return;
    
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 300) {
      alert("스크롤이 너무 빠릅니다.");
      return;
    }
    loadingRef.current = false;
    lastFetchTimeRef.current = now;

    const container = containerRef.current;
    const prevScrollHeight = container.scrollHeight;

    apiClient
      .get("/api/messages", {
        params: {
          channelId: selectedChannel.channelId,
          size: messageList.size,
          cursor: messageList.cursor,
          after: messageList.after,
        },
      })
      .then((res) => {
        setMessageList((prev) => {
          const merged = [...prev.content, ...res.data.content];

          const uniqueContent = Array.from(
            new Map(merged.map((msg) => [msg.messageId, msg])).values()
          );

          return {
            ...res.data,
            content: uniqueContent,
          };
        });

        // 스크롤 위치 보정 (튐 방지)
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        });
      })
      .catch(console.error);
  };

  // 스크롤 감지
  const handleScroll = () => {
    if (!containerRef.current) return;

    if (containerRef.current.scrollTop <= 10) {
      loadNextMessages();
    }
  };

  useEffect(() => {
    if (!selectedChannel) return;
    loadMessage();
  }, [selectedChannel]);

  // 처음 로딩, 새로고침, 채널 이동 때 스크롤이 맨 아래 위치
  useEffect(() => {
    if (!initialScrollRef.current) return;
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
      initialScrollRef.current = false;
    });
  }, [messageList]);

  return (
    <>
      <div className="chat-content-area">
        <div className="message-content-area">
          <MessageListArea
            messageList={[...messageList.content].reverse()}
            ref={containerRef}
            onScroll={handleScroll}
          />
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
