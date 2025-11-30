import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import { getProfileImg } from "../../utils/profile";

const MemberItem = ({ userId, isManager }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiClient
      .get(`/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <>
      <div className={`user-item ${isManager ? "manager" : ""}`}>
        <div className="profile-wrap">
          <img src={getProfileImg(user?.profileImg)} alt="" />
        </div>
        <div className="user-info">
          <p className="nickname">{user?.nickname}</p>
        </div>
      </div>
    </>
  );
};

export default MemberItem;
