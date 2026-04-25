import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateForm } from "../../utils/validation";

import Input from "../ui/Input";
import Button from "../ui/Button";
import EmailAuth from "../auth/EmailChk";
import apiClient from "../../api/client";

const FindPassword = () => {
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [nickName, setNickName] = useState("");
  const navigate = useNavigate();

  //요청 보내기 전 체킹
  const chkSubmit = (e) => {
    if (!checkedEmail) {
      alert("이메일 인증 확인을 진행해주세요.");
      return false;
    }
    return true;
  };

  //비밀번호 보내기
  const sendPassword = async (e) => {
    validateForm(e);
    if (!chkSubmit(e)) {
      return;
    }

    apiClient
      .post("/api/users/password/reset", {
        email: checkedEmail,
        nickname: nickName,
      })
      .then((res) => {
        alert(
          "이메일로 임시 비밀번호가 발송되었습니다. 로그인 화면으로 이동합니다.\n로그인 후 반드시 비밀번호를 변경해주세요"
        );
        navigate("/login");
        return false;
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data?.code === "USER_005") {
          alert("가입한 닉네임과 일치하지 않습니다");
        }
      });
  };

  return (
    <>
      <div className="login-page">
        <div className="login-box">
          <div className="login-title">
            <Link to="/login" className="btn btn-back btn-ico-only btn-lg" aria-label="로그인 페이지로 이동">
              <i className="bi bi-arrow-left"></i>
            </Link>
            <span className="text-area">
              <span className="title">비밀번호 찾기</span>
              <span className="descript">
                가입하신 이메일로 임시 비밀번호를 발급합니다.
              </span>
            </span>
          </div>
          <div className="form-wrap">
            <form action="" method="post">
              <EmailAuth usage="findId" onVerified={setCheckedEmail} />
              <div className="form-group floating-label">
                <Input
                  id="nickName"
                  placeholder="아이디 입력"
                  value={nickName}
                  setValue={setNickName}
                />
                <label htmlFor="nickName">아이디 입력</label>
              </div>
              <div className="btns-wrap-virtical">
                <Button
                  addClassName="btn-primary btn-login"
                  text="확인"
                  onClick={sendPassword}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindPassword;
