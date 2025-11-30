// src/contexts/channel/ChannelStateContext.js
import { createContext, useContext } from "react";

export const ChannelStateContext = createContext(null);

export const useChannelState = () => {
  const context = useContext(ChannelStateContext);
  if (!context) {
    throw new Error("useChannelState를 사용하려면 반드시 ChannelProvider로 감싸져 있어야 합니다.");
  }
  return context;
};
