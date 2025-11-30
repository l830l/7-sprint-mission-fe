import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import EmailAuth from "../auth/EmailChk";
import { validateForm } from "../../utils/validation";
import apiClient from "../../api/client";

const FindId = () => {
  const [checkedEmail, setCheckedEmail] = useState(false);
  const navigate = useNavigate();

  //요청 보내기 전 체킹
  const chkSubmit = (e) => {
    if (!checkedEmail) {
      alert("이메일 인증 확인을 진행해주세요.");
      return false;
    }
    return true;
  };

  //아이디 보내기
  const sendId = async (e) => {
    validateForm(e);
    if (!chkSubmit(e)) {
      return;
    }

    apiClient
      .post("/api/users/id", null, {
        params: {
          email: checkedEmail,
        },
      })
      .then((res) => {
        alert(
          "이메일로 가입하신 닉네임이 발송되었습니다. 로그인 화면으로 이동합니다."
        );
        navigate("/login");
        return false;
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
              <span className="title">아이디 찾기</span>
              <span className="descript">
                가입하신 이메일로 아이디를 보내드립니다
              </span>
            </span>
          </div>
          <div className="form-wrap">
            <form action="" method="post">
              <EmailAuth usage="findId" onVerified={setCheckedEmail} />
              <div className="btns-wrap-virtical">
                <Button
                  addClassName="btn-primary"
                  text="확인"
                  onClick={sendId}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindId;
