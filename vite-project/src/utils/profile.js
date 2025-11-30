export const getProfileImg = (profileImg) => {
    if (!profileImg || !profileImg.data) return "/images/default-avatar.svg";
    return `data:image/jpeg;base64,${profileImg.data}`;
  };