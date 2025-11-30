// src/contexts/channel/ChannelProvider.js
import { useState, useCallback } from "react";
import { ChannelStateContext } from "./ChannelStateContext";
import { ChannelDispatchContext } from "./ChannelDispatchContext";

const ChannelProvider = ({ children }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);

  // 채널 선택 메서드
  const selectChannel = useCallback((channel) => {
    setSelectedChannel(channel);
  }, []);

  return (
    <ChannelStateContext.Provider value={{ selectedChannel }}>
      <ChannelDispatchContext.Provider value={{ selectChannel }}>
        {children}
      </ChannelDispatchContext.Provider>
    </ChannelStateContext.Provider>
  );
};

export default ChannelProvider;
