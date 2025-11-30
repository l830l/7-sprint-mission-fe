import { useEffect } from "react";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import IcoButton from "../ui/IcoButton";
import MemberItem from "./MemberItem";

const MemberList = () => {
  const { selectedChannel } = useChannelState();
  // 방장은 맨 위 + 중복 제거
  const { managerId, userIds } = selectedChannel;
  const orderedUsers = [managerId, ...userIds.filter((id) => id !== managerId)];

  return (
    <>
      <div className="title-wrap">
        <p className="title">
          현재 참여 인원 <span className="count">{orderedUsers?.length}</span>
        </p>
        <IcoButton
          icoClass="bi-plus-lg"
          addClassName="btn-add-user"
          title="방에 유저 추가"
        />
      </div>
      <div className="user-list">
        {orderedUsers.map((userId) => (
          <MemberItem
            key={userId}
            userId={userId}
            isManager={userId === managerId} // 🔥 방장 여부 전달
          />
        ))}
      </div>
    </>
  );
};

export default MemberList;
