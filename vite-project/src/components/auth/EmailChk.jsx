import apiClient from "../../api/client";

import { useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { validateInputs } from "../../utils/validation";

const EmailAuth = ({ usage, onVerified }) => {
  const [email, setEmail] = useState("");
  const [num, setNum] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //가입된 이메일인지 확인
  const chkRegisterUser = async () => {
    const { data, status, error } = await apiClient.get(
      "/api/users/duplication/email",
      {
        params: { email },
      }
    );
    return data.available;
  };

  //분기 : 가입되어있을 때 진행
  const isContinue = async () => {
    const available = await chkRegisterUser();

    //회원가입
    if (available && usage === "signUp") {
      if (
        confirm(
          "이미 가입되어있는 이메일입니다. 로그인 화면으로 이동하시겠습니까?"
        )
      ) {
        navigate("/login");
        return false;
      } else {
        return false;
      }
    }

    //아이디 찾기 또는 비밀번호
    if (!available && (usage === "findId" || usage === "findPassword")) {
      alert("가입되어 있지 않은 이메일입니다.");
      return false;
    }

    return true;
  };

  //인증 코드 발송
  const sendCode = async (e) => {
    e.preventDefault();
    if (verified) return;
    if (!validateInputs(e, ["#email"])) return;
    if (!(await isContinue())) return;
    setLoading(true);

    apiClient
      .post("/api/auth/email-code", {
        email,
      })
      .then((res) => {
        alert("인증번호가 발송되었습니다.");
        setSent(true);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  //인증 코드 확인
  const verifyCode = async (e) => {
    e.preventDefault();
    if (!num) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    apiClient
      .post("/api/auth/email-code/verify", {
        email,
        code: num,
      })
      .then((res) => {
        if (res.data.isVerified) {
          setVerified(true);
          alert("이메일 인증 완료!");
          onVerified(email);
        } else {
          alert(
            "인증번호가 만료되었거나 올바르지 않습니다.\n- 발송 후 5분 경과 또는 재발송 시 이전에 발송한 인증번호는 자동으로 만료됩니다."
          );
        }
      })
      .catch((err) => {
        console.error(err);
        alert(err?.response?.data?.message || "인증번호가 올바르지 않습니다.");
      })
      .finally(setLoading(false));
  };

  return (
    <>
      <div className="form-group form-group-hr floating-label">
        <Input
          id="email"
          placeholder="이메일"
          type="email"
          value={email}
          setValue={setEmail}
          disabled={verified}
          validation={{
            required: true,
          }}
        />
        <label htmlFor="email">이메일</label>
        <Button
          addClassName={sent ? "btn-secondary" : "btn-success" + " chk-email"}
          text={!verified ? (sent ? "재발송" : "인증") : "인증완료"}
          onClick={verified ? sendCode : sendCode}
          disabled={loading || verified}
        />
      </div>

      {sent && !verified && (
        <div className="form-group floating-label form-group-hr">
          <Input
            id="num"
            placeholder="인증번호 입력"
            value={num}
            setValue={setNum}
          />
          <label htmlFor="num">인증번호 입력</label>
          <Button
            addClassName="btn-success verify-code"
            text="확인"
            onClick={verifyCode}
          />
        </div>
      )}
    </>
  );
};

export default EmailAuth;
