import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import UserModifyModal from "../modal/UserModifyModal";
import { getImg } from "../../utils/profile";
import { useUserState } from "../../context/user/UserStateContext";
import { useNavigate } from "react-router-dom";
import { useUserDispatch } from "../../context/user/UserDispatchContext";
import apiClient from "../../api/client";

const InfoBox = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const user = useUserState();
  const setUser = useUserDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!confirm("정말 로그아웃 하시겠습니까?")) return
      
    apiClient.post("/api/auth/logout", null, {
       withCredentials: true
    })
    .then(res => {
      setUser(null);
      navigate("/login");
    })
    .catch(err => {
        console.err(err);
        alert("로그아웃에 실패하였습니다");
    })
  };

  return (
    <>
      <div className="infobox">
        <div className="profile-wrap">
          <img src={getImg(user?.profileImg)} alt="프로필 이미지" />
        </div>
        <div className="info-text-area">
          <span className="nickname">{user?.nickname}</span>
          <span className="email">{user?.email}</span>
          <div className="btns-wrap">
            <Button
              text="정보수정"
              addClassName="btn-sm btn-dark"
              onClick={openModal}
            />
            <Button
              text="로그아웃"
              addClassName="btn-sm btn-dark"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
      <UserModifyModal show={showModal} onClose={closeModal} />
    </>
  );
};

export default InfoBox;
