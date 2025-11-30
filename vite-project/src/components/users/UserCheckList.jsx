import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import Input from "../ui/Input";
import IcoButton from "../ui/IcoButton";
import { getProfileImg } from "../../utils/profile";
import { highlightText } from "../../utils/highlight_text";

const UserCheckList = ({ selectedIds = [], mineId, onChange }) => {
  const [search, setSearch] = useState("");
  const [checkedList, setCheckedList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = () => {
      apiClient
        .get("/api/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.error(err));
    };
    fetchUsers();
  }, []);

  // 부모에서 내려온 selectedIds 초기 반영
  useEffect(() => {
    setCheckedList(selectedIds);
  }, [selectedIds]);

  // 체크박스 토글
  const toggle = (userId) => {
    let updated;

    if (checkedList.includes(userId)) {
      updated = checkedList.filter((id) => id !== userId);
    } else {
      updated = [...checkedList, userId];
    }

    setCheckedList(updated);
    onChange(updated); // 부모에게 전달
  };

  // 자기자신 제외
  const filteredUsers = users
    .filter((u) => u.userId !== mineId)
    .filter(
      (u) =>
        u.nickname.toUpperCase().includes(search.toUpperCase()) ||
        u.email.toUpperCase().includes(search.toUpperCase())
    );

  return (
    <>
      <div className="user-list-area">
        <div className="form-group form-group-hr form-search">
          <Input
            id="search"
            value={search}
            setValue={setSearch}
            placeholder={"유저 이메일 또는 닉네임 검색"}
          />
          <label htmlFor="search" className="visually-hidden">
            검색어 입력
          </label>
        </div>

        <div className="user-list">
          {/* 유저 목록 */}
          {filteredUsers.length === 0 && (
            <p className="no-content">검색 결과가 없습니다.</p>
          )}

          <div className="list-group">
            {filteredUsers.map((user) => (
              <label
                className="list-group-item d-flex align-items-center"
                key={user.userId}
              >
                {/* 프로필 이미지 */}
                <img
                  src={getProfileImg(user.profileImg)}
                  alt="profile"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />

                {/* 닉네임 & 이메일 */}
                <div className="ms-3 flex-fill">
                  <div className="fw-bold">
                    {highlightText(user.nickname, search)}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {highlightText(user.email, search)}
                  </div>
                </div>

                {/* 체크박스 */}
                <div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkedList.includes(user.userId)}
                    onChange={() => toggle(user.userId)}
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCheckList;
