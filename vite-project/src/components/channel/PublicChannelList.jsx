import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useChannelDispatch } from "../../context/channel/ChannelDispatchContext";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { highlightText } from "../../utils/highlight_text";

const PublicChannelList = ({ publicList, searchTxt }) => {
  const { selectedChannel } = useChannelState();
  const { selectChannel } = useChannelDispatch();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(publicList?.length);
  }, [publicList]);

  useEffect(() => {
    if (!selectedChannel && publicList?.length > 0) {
      selectChannel(publicList[0]);
    }
  }, [publicList, selectedChannel, selectChannel]);

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span>
            <span>공개채널</span>
            <span className="count">{count}</span>
          </span>
        </Accordion.Header>
        <Accordion.Body>
          <div className="channel-list">
            {publicList && publicList.length > 0 ? (
              publicList.map((ch) => (
                <button
                  key={ch.channelId}
                  className={
                    "channel-item " +
                    (selectedChannel?.channelId === ch.channelId
                      ? "selectedChannel"
                      : "")
                  }
                  onClick={() => selectChannel(ch)}
                >
                  <span className="channel-name">
                    {highlightText(ch.name, searchTxt)}
                  </span>
                </button>
              ))
            ) : (
              <p className="no-content-txt">채널이 없습니다.</p>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default PublicChannelList;
