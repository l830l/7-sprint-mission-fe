import apiClient from "../../api/client";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Button from "../ui/Button";
import Input from "../ui/Input";

import { validateForm } from "../../utils/validation";

const Login = ({ setIsLoggedIn }) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //이 페이지로 오면 로그인 상태를 false 로 만듬
  useEffect(() => {
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  //로그인 버튼을 눌렀을 때
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm(e)) return; // 공통 validation 사용

    apiClient
      .post("/api/auth/login", {
        nickname,
        password,
      })
      .then((res) => {
        const { data } = res;
        sessionStorage.setItem("user", JSON.stringify(data));
        setIsLoggedIn(true);
        navigate("/chatroom");
      })
      .catch((err) => {
        const messages = {
          AUTH_001: "해당 닉네임의 유저가 존재하지 않습니다.",
          AUTH_002: "비밀번호가 올바르지 않습니다.",
        };
        alert(
          messages[err.response.data.code] ||
            " principle950@daum.net으로 문의주세요."
        );
      });
  };

  return (
    <>
      <div className="login-page">
        <div className="login-box">
          <p className="login-title">
            <img src="/images/logo_v.svg" alt="Logo" />
          </p>
          <div className="form-wrap">
            <form action="" method="post">
              <div className="form-group floating-label">
                <Input
                  id="nickName"
                  placeholder="아이디 입력"
                  value={nickname}
                  setValue={setNickname}
                  validation={{
                    required: true,
                    minLength: 2,
                    pattern: "[가-힣a-zA-Z0-9]+",
                  }}
                />
                <label htmlFor="nickName">아이디 입력</label>
              </div>
              <div className="form-group floating-label">
                <Input
                  type="password"
                  id="password"
                  placeholder="비밀번호"
                  value={password}
                  setValue={setPassword}
                  validation={{
                    required: true,
                    minLength: 6,
                  }}
                />
                <label htmlFor="password">비밀번호</label>
              </div>
              <div className="btns-wrap-virtical">
                <Button
                  addClassName="btn-primary btn-login"
                  text="로그인"
                  onClick={handleLogin}
                />
                <Link to="/sign-up" className="btn btn-secondary">
                  회원가입
                </Link>
              </div>
            </form>
          </div>
          <div className="sign-up-area">
            <Link to="/find-id" className="link link-grey">
              아이디 찾기
            </Link>
            <Link to="/find-password" className="link link-grey">
              비밀번호 찾기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
