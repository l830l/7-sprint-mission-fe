import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import apiClient from "../../api/client";
import { getProfileImg } from "../../utils/profile";
import { useChannelDispatch } from "../../context/channel/ChannelDispatchContext";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { highlightText } from "../../utils/highlight_text";

const PrivateChannelList = ({ privateList, searchTxt }) => {
  const [count, setCount] = useState(0);
  const [membersMap, setMembersMap] = useState({}); // userId → user info
  const [managerMap, setManagerMap] = useState({}); // managerId → user info
  const { selectedChannel } = useChannelState();
  const { selectChannel } = useChannelDispatch();

  useEffect(() => {
    setCount(privateList?.length);

    if (!privateList || privateList.length === 0) return;

    // userId와 managerId를 모두 수집 (중복 제거)
    const allUserIds = Array.from(
      new Set([
        ...privateList.flatMap((ch) => ch.userIds),
        ...privateList.map((ch) => ch.managerId),
      ])
    );

    // 모든 userId 요청
    // 모든 userId 요청
    Promise.all(
      allUserIds.map((userId) =>
        apiClient.get(`/api/users/${userId}`).then((res) => ({
          userId,
          data: res.data,
        }))
      )
    ).then((results) => {
      const memberMap = {};
      const mgrMap = {};
      results.forEach((r) => {
        // 각 채널의 managerId와 userIds에 따라 구분
        if (privateList.some((ch) => ch.managerId === r.userId)) {
          mgrMap[r.userId] = r.data;
        } else {
          memberMap[r.userId] = r.data;
        }
      });
      setMembersMap(memberMap);
      setManagerMap(mgrMap);
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
                const manager = managerMap[ch.managerId];
                const members = ch.userIds
                  .map((id) => membersMap[id])
                  .filter(Boolean);

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
                    {/* 방장 프로필 이미지 */}
                    <div className="profile-wrap">
                      {manager && (
                        <img
                          src={getProfileImg(manager?.profileImg)}
                          alt={manager.nickname}
                          className="profile-thumb"
                        />
                      )}
                    </div>
                    <div className="info-wrap">
                      {/* 방 이름 */}
                      <div className="channel-name">
                        {highlightText(ch.channelName, searchTxt)}
                      </div>
                      {/* 방장 이름 */}
                      <div className="manager-name">
                        {manager && <>방장: {manager.nickname}</>}
                      </div>

                      {/* 멤버 닉네임 목록 */}
                      <div className="names">
                        {members.length > 0
                          ? members.map((m, i) => (
                              <span key={m.userId || i} className="member-item">
                                {m.nickname}
                              </span>
                            ))
                          : "멤버 없음"}
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
