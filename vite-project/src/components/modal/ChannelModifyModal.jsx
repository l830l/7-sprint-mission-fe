// MyModal.jsx
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import EmailAuth from "../auth/EmailChk";
import Toggle from "../ui/Toggle";
import { base64ToFile } from "../../utils/base64to_file";
import { validateForm, validateInputs } from "../../utils/validation";
import apiClient from "../../api/client";
import { Modal } from "react-bootstrap";
import { useUserState } from "../../context/user/UserStateContext";
import { useNavigate } from "react-router-dom";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { useChannelDispatch } from "../../context/channel/ChannelDispatchContext";

const ChannelModifyModal = ({ show, onClose }) => {
  const user = useUserState();
  const { selectedChannel } = useChannelState();
  const { selectChannel } = useChannelDispatch();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");

  //초기값 세팅
  useEffect(() => {
    setChannelName(selectedChannel ? selectedChannel.name : "");
    setDescription(selectedChannel ? selectedChannel.description : "");
  }, [show, selectedChannel]);

  //공개방 수정
  const chkSubmit = (e) => {
    validateForm(e);
    if (!channelName) {
      return false;
    }
    return true;
  };
  const updateChannel = (e) => {
    if (!chkSubmit(e)) return;
    apiClient
      .patch("/api/channels/" + selectedChannel.channelId, {
        name: channelName,
        description: description,
      })
      .then((res) => {
        alert("채널 변경이 완료되었습니다");
        selectChannel(res.data);
        onClose();
      })
      .catch((err) => console.error(err));
  };
  //취소
  const cancle = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        backdrop="static" // 배경 클릭해도 닫히지 않음
        keyboard={false} // ESC 키 눌러도 닫히지 않음
        centered
      >
        <form action="" method="post">
          <Modal.Header closeButton>
            <Modal.Title>채널 정보 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group floating-label">
              <Input
                id="channelName"
                placeholder="채널 이름"
                value={channelName}
                setValue={setChannelName}
                validation={{
                  required: true,
                  minLength: 1,
                  pattern: "[가-힣a-zA-Z0-9]+",
                }}
              />
              <label htmlFor="channelName">채널 이름</label>
            </div>
            <div className="form-group floating-label">
              <Input
                id="description"
                placeholder="채널 설명"
                value={description}
                setValue={setDescription}
              />
              <label htmlFor="description">채널 설명</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button addClassName="btn-dark" text="취소" onClick={cancle} />
            <Button
              addClassName="btn-primary"
              text="수정"
              onClick={updateChannel}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ChannelModifyModal;
