import { useEffect, useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import EmailAuth from "../auth/EmailChk";
import { validateForm, validateInputs } from "../../utils/validation";
import apiClient from "../../api/client";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [chkDuplicateDone, setChkDuplicateDone] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState(false);

  const navigate = useNavigate();

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
    setChkDuplicateDone(false);
  }, [nickName]);

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

  //요청 보내기 전 체킹
  const chkSubmit = (e) => {
    validateForm(e);
    if (!chkDuplicateDone) {
      alert("닉네임 중복확인을 완료해주세요.");
      return false;
    }

    if (!checkedEmail) {
      alert("이메일 인증 확인을 진행해주세요.");
      return false;
    }

    if (password !== passwordChk) {
      alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
      return false;
    }
    return true;
  };

  //회원 등록
  const submitSignUp = (e) => {
    if (!chkSubmit(e)) {
      return;
    }

    const formData = new FormData();
    const userInfo = {
      nickname: nickName,
      email: checkedEmail,
      password: password,
    };

    formData.append(
      "userInfoReq",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    if (profileImg) {
      formData.append("profile", profileImg);
    }

    apiClient
      .post("/api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="login-page">
        <div className="login-box">
          <div className="login-title">
            <span className="text-area">
              <span className="title">회원가입</span>
            </span>
          </div>
          <div className="form-wrap">
            <form action="" method="post">
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
              <EmailAuth usage="signUp" onVerified={setCheckedEmail} />
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
                <label htmlFor="password">비밀번호</label>
              </div>
              <div className="form-group floating-label">
                <Input
                  id="passwordChk"
                  placeholder="비밀번호 확인"
                  value={passwordChk}
                  setValue={setPasswordChk}
                  type="password"
                />
                <label htmlFor="passwordChk">비밀번호 확인</label>
              </div>
              <div className="btns-wrap-virtical">
                <Button
                  addClassName="btn-primary btn-login"
                  text="가입"
                  onClick={submitSignUp}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
