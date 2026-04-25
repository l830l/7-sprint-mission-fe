export const getImg = (profileImg) => {
  if (!profileImg || !profileImg.binaryContentId) return "/images/default-avatar.svg";
  return `http://localhost:8080/api/binary-contents/${profileImg.binaryContentId}`;
};