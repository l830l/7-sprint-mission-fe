// MyModal.jsx
import { Tabs, Tab } from "react-bootstrap";

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
import UserCheckList from "../users/UserCheckList";

const ChannelCreateModal = ({ show, onClose, getChannelList }) => {
  const user = useUserState();
  const navigate = useNavigate();
  const [key, setKey] = useState("public");

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setChannelName("");
    setDescription("");
    setSelectedIds([]);
  }, [show, key]);

  //공개방 생성
  const chkSubmit = (e) => {
    validateForm(e);
    if (!channelName) {
      return false;
    }
    return true;
  };
  const createPublic = (e) => {
    if (!chkSubmit(e)) return;
    apiClient
      .post(
        "/api/channels/public",
        {
          name: channelName,
          description: description,
        },
        {
          headers: {
            "X-LOGINUSER-ID": user?.userId,
          },
        }
      )
      .then((res) => {
        getChannelList();
        onClose();
      })
      .catch((err) => console.error(err));
  };

  //비밀방 생성
  const createPrivate = (e) => {
    apiClient
      .post(
        "/api/channels/private",
        {
          userIds: selectedIds,
        },
        {
          headers: {
            "X-LOGINUSER-ID": user?.userId,
          },
        }
      )
      .then((res) => {
        getChannelList();
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
        <Modal.Header closeButton>
          <Modal.Title>채널 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="public" title="공개방">
              <form action="" method="post">
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
                <div className="btns-wrap">
                  <Button
                    addClassName="btn-dark"
                    text="취소"
                    onClick={cancle}
                  />
                  <Button
                    addClassName="btn-primary"
                    text="생성"
                    onClick={createPublic}
                  />
                </div>
              </form>
            </Tab>
            <Tab eventKey="private" title="비밀방">
              <UserCheckList
                selectedIds={selectedIds}
                mineId={user.userId}
                onChange={setSelectedIds}
              />
              <div className="btns-wrap">
                <Button addClassName="btn-dark" text="취소" onClick={cancle} />
                <Button
                  addClassName="btn-primary"
                  text="생성"
                  onClick={createPrivate}
                />
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ChannelCreateModal;
