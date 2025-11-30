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
import { useUserDispatch } from "../../context/user/UserDispatchContext";
import { useNavigate } from "react-router-dom";

const UserModifyModal = ({ show, onClose }) => {
  const user = useUserState();
  const setUser = useUserDispatch();
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [chkDuplicateDone, setChkDuplicateDone] = useState(true);
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [isReplaceEmail, setIsReplaceEmail] = useState(false);
  const [isReplacePassword, setIsReplacePassword] = useState(false);

  useEffect(() => {
    if (show) {
      setNickName(user?.nickname ?? "");
      setPassword(user?.password ?? "");
      setIsReplaceEmail(false);
      setIsReplacePassword(false);
      setPreviewImg(
        user?.profileImg?.data
          ? `data:image/jpeg;base64,${user?.profileImg.data}`
          : null
      );
      // Base64 → File 변환
      if (user?.profileImg?.data) {
        const file = base64ToFile(
          user?.profileImg.data,
          "profile.jpg",
          "image/jpeg"
        );
        setProfileImg(file);
      } else {
        setProfileImg(null);
      }
    }
  }, [show, user]);

  //프로필 사진
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file)); // 브라우저에서 미리보기용 URL 생성
    }
  };

  //닉네임 필드를 바꾸면 다시 중복체크 하게
  useEffect(() => {
    const original = (user?.nickname || "").trim();
    const current = (nickName || "").trim();

    // 원래 그대로면 중복체크 완료 상태 유지
    if (original === current) {
      setChkDuplicateDone(true);
      return;
    }

    // 원래와 다르면 중복체크 다시 해야 함
    setChkDuplicateDone(false);
  }, [nickName, user]);

  //닉네임 중복체크
  const handleChkDuplicate = async (e) => {
    if (!validateInputs(e, ["#nickName"])) return;
    if (chkDuplicateDone) return;

    apiClient
      .get("/api/users/duplication/nickname", {
        params: { nickname: nickName },
      })
      .then((res) => {
        setChkDuplicateDone(!res.data.available);
        if (!res.data.available) {
          alert("사용 가능한 아이디입니다.");
        } else {
          alert("사용 불가능한 아이디입니다.");
        }
      })
      .catch((err) => console.err(err));
  };

  //토글 전후 필드 비우기
  useEffect(() => {
    setPassword("");
    setPasswordChk("");
  }, [isReplacePassword]);

  useEffect(() => {
    setCheckedEmail(null);
  }, [isReplaceEmail]);

  //요청 보내기 전 체킹
  const chkSubmit = (e) => {
    validateForm(e);

    if (!chkDuplicateDone) {
      alert("닉네임 중복확인을 완료해주세요.");
      return false;
    }

    if (isReplaceEmail && !checkedEmail) {
      alert("이메일 인증 확인을 진행해주세요.");
      return false;
    }

    if (isReplacePassword && password !== passwordChk) {
      alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
      return false;
    }

    return true;
  };

  //회원 수정
  const submitUpdate = (e) => {
    if (!chkSubmit(e)) {
      return;
    }

    const formData = new FormData();

    const userInfo = {
      nickname: nickName,
    };

    if (isReplacePassword) {
      userInfo.password = password;
    } else {
      userInfo.password = null;
    }

    if (isReplaceEmail) {
      userInfo.email = checkedEmail;
    } else {
      userInfo.email = user.email;
    }

    formData.append(
      "userInfoReq",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    if (profileImg) {
      formData.append("profile", profileImg);
    }

    apiClient
      .put("/api/users/" + user?.userId, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert("수정이 완료되었습니다.");
        sessionStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        onClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //회원 탈퇴
  const onDeleteUser = (e) => {
    e.preventDefault();

    if (
      confirm(
        "이 작업은 되돌릴 수 없으며, 복구가 불가능합니다. 정말 탈퇴하시겠습니까?"
      )
    ) {
      apiClient
        .delete("/api/users/" + user?.userId)
        .then((res) => {
          sessionStorage.removeItem("user");
          setUser(null);
          navigate("/login");
        })
        .catch((err) => console.error(err));
    }
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
            <Modal.Title>유저 정보 수정</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-wrap">
              <div className="form-group profile-group">
                <label htmlFor="profileImage">
                  <img
                    src={previewImg || "/images/default-avatar.svg"} // 기본 이미지
                    alt="프로필"
                  />
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                />
              </div>
              <div className="form-group floating-label form-group-hr form-check-group">
                <Input
                  id="nickName"
                  placeholder="아이디 입력"
                  value={nickName}
                  setValue={setNickName}
                  validation={{
                    required: true,
                    minLength: 2,
                    pattern: "[가-힣a-zA-Z0-9]+",
                  }}
                />
                <label htmlFor="nickName">아이디 입력</label>
                <Button
                  addClassName={
                    chkDuplicateDone
                      ? "btn-secondary"
                      : "btn-success" + " chk-email"
                  }
                  text={chkDuplicateDone ? "체크완료" : "중복체크"}
                  onClick={handleChkDuplicate}
                />
              </div>
              <div className="form-group">
                <Toggle
                  id="isReplaceEmail"
                  checked={isReplaceEmail}
                  onChange={() => setIsReplaceEmail(!isReplaceEmail)}
                  text="이메일도 변경"
                />
                <div className={`switch-area ${isReplaceEmail ? "on" : "off"}`}>
                  {isReplaceEmail ? (
                    <EmailAuth usage="signUp" onVerified={setCheckedEmail} />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="form-group">
                <Toggle
                  id="isReplacePassword"
                  checked={isReplacePassword}
                  onChange={() => setIsReplacePassword(!isReplacePassword)}
                  text="비밀번호도 변경"
                />
                <div
                  className={`switch-area ${isReplacePassword ? "on" : "off"}`}
                >
                  {isReplacePassword ? (
                    <>
                      <div className="form-group floating-label form-check-group">
                        <Input
                          id="password"
                          placeholder="비밀번호"
                          value={password}
                          setValue={setPassword}
                          type="password"
                          validation={{
                            required: true,
                            minLength: 6,
                          }}
                        />
                        <label htmlFor="password">변경할 비밀번호</label>
                      </div>
                      <div className="form-group floating-label">
                        <Input
                          id="passwordChk"
                          placeholder="비밀번호 확인"
                          value={passwordChk}
                          setValue={setPasswordChk}
                          type="password"
                        />
                        <label htmlFor="passwordChk">
                          변경할 비밀번호 확인
                        </label>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              addClassName="btn-danger btn-delete-user"
              text="회원탈퇴"
              onClick={onDeleteUser}
            />
            <Button addClassName="btn-dark" text="취소" onClick={onClose} />
            <Button
              addClassName="btn-primary"
              text="수정"
              onClick={submitUpdate}
            />
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default UserModifyModal;
