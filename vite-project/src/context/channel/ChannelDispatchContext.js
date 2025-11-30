// src/contexts/channel/ChannelDispatchContext.js
import { createContext, useContext } from "react";

export const ChannelDispatchContext = createContext(null);

export const useChannelDispatch = () => {
  const context = useContext(ChannelDispatchContext);
  if (!context) {
    throw new Error("useChannelDispatch must be used within ChannelProvider");
  }
  return context;
};
