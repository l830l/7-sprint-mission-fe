import { useEffect, useState } from "react";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { useChannelDispatch } from "../../context/channel/ChannelDispatchContext";
import { useUserState } from "../../context/user/UserStateContext";

import ChannelModifyModal from "../modal/ChannelModifyModal";
import IcoButton from "../ui/IcoButton";
import apiClient from "../../api/client";

const Header = ({ isOpen, setIsOpen }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const { selectedChannel } = useChannelState();
  const { selectChannel } = useChannelDispatch();

  const user = useUserState();
  const handleSidebar = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const deleteChannel = () => {
    if (
      confirm(
        "이 작업은 되돌릴 수 없으며, 복구가 불가능 합니다. 정말 삭제하시겠습니까?"
      )
    ) {
      apiClient
        .delete("/api/channels/" + selectedChannel.channelId)
        .then((res) => {
          selectChannel(null);
        })
        .catch((err) => console.error(err));
    }
  };
  return (
    <>
      <header className="header">
        <IcoButton
          icoClass="bi-layout-sidebar"
          addClassName={`btn-menu ${isOpen ? "on" : ""}`}
          title="사이드 메뉴 열기"
          onClick={handleSidebar}
        />

        <span className="chatroom-name">
          {selectedChannel?.name ?? selectedChannel?.channelName}
        </span>
        <div className="btns-wrap">
          {user?.userId === selectedChannel?.managerId &&
          selectedChannel?.type === "public" ? (
            <IcoButton
              icoClass="bi-pencil-square"
              addClassName="btn-modify"
              title="채널 수정"
              onClick={openModal}
            />
          ) : (
            <></>
          )}

          {user?.userId === selectedChannel?.managerId ? (
            <>
              <IcoButton
                icoClass="bi-trash"
                addClassName="btn-delete danger"
                title="채널 삭제"
                onClick={deleteChannel}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </header>
      <ChannelModifyModal show={showModal} onClose={closeModal} />
    </>
  );
};

export default Header;
