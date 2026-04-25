import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import apiClient from "../../api/client";
import { getImg } from "../../utils/profile";
import { useChannelDispatch } from "../../context/channel/ChannelDispatchContext";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { highlightText } from "../../utils/highlight_text";

const PrivateChannelList = ({ privateList, searchTxt }) => {
  const [count, setCount] = useState(0);
  const [membersMap, setMembersMap] = useState({}); // userId → user info

  const { selectedChannel } = useChannelState();
  const { selectChannel } = useChannelDispatch();

  useEffect(() => {
    setCount(privateList?.length ?? 0);

    if (!privateList || privateList.length === 0) {
      setMembersMap({});
      return;
    }

    // 모든 채널에서 필요한 userId 수집 (중복 제거)
    const allUserIds = Array.from(
      new Set(
        privateList.flatMap((ch) => [
          ch.managerId,
          ...(ch.userIds || []),
        ])
      )
    );

    Promise.all(
      allUserIds.map((userId) =>
        apiClient.get(`/api/users/${userId}`).then((res) => ({
          userId,
          data: res.data,
        }))
      )
    ).then((results) => {
      const userMap = {};

      results.forEach(({ userId, data }) => {
        userMap[userId] = data;
      });

      setMembersMap(userMap);
    });
  }, [privateList]);

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span>
            <span>비공개채널</span>
            <span className="count">{count}</span>
          </span>
        </Accordion.Header>

        <Accordion.Body>
          <div className="channel-list private-list">
            {privateList && privateList.length > 0 ? (
              privateList.map((ch) => {
                const manager = membersMap[ch.managerId];

                const memberNicknames = ch.userIds
                  ?.filter((id) => id !== ch.managerId) // 방장 제외
                  .map((id) => membersMap[id])
                  .filter(Boolean)
                  .map((user) => user.nickname);

                return (
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
                    {/* 방장 프로필 */}
                    <div className="profile-wrap">
                      {manager && (
                        <img
                          src={getImg(manager.profileImg)}
                          alt={manager.nickname}
                          className="profile-thumb"
                        />
                      )}
                    </div>

                    <div className="info-wrap">
                      {/* 방 이름 */}
                      <div className="channel-name">
                        {highlightText(ch.name, searchTxt)}
                      </div>

                      {/* 방장 이름 */}
                      <div className="manager-name">
                        {manager && <>방장: {manager.nickname}</>}
                      </div>

                      {/* 멤버 닉네임 목록 */}
                      <div className="names">
                        {memberNicknames?.length > 0
                          ? memberNicknames.join(", ")
                          : "참가 멤버 없음"}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="no-content-txt">채널이 없습니다.</p>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default PrivateChannelList;
