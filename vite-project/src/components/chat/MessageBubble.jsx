import { useEffect, useState } from "react";
import { getImg } from "../../utils/profile";
import apiClient from "../../api/client";
import { formatKoreanTime } from "../../utils/format_time";

const MessageBubble = ({ message, currentUser }) => {
  const isMine = message.speakerId === currentUser.userId;
  const [speaker, setSpeaker] = useState(null);

  useEffect(() => {
    if (!message) return;
    apiClient
      .get(`/api/users/${message.speakerId}`)
      .then((res) => setSpeaker(res.data))
      .catch((err) => console.error(err));
  }, [message]);

  const renderAttachment = (att, idx) => {
    if (!att) return null;

    const isImage = att.fileType?.startsWith("image/");
    const blobUrl = getImg(att);

    if (isImage) {
      return (
        <div key={idx} className="attachment-image">
          <img src={blobUrl} alt={att.fileName} />
          <a
            href={blobUrl}
            download={att.fileName}
            className="attachment-download"
          >
            <i className="bi bi-download"></i>
          </a>
        </div>
      );
    } else {
      return (
        <div key={idx} className="attachment-file">
          <a href={blobUrl} download={att.fileName}>
            {att.fileName || "첨부파일"} 다운로드
          </a>
        </div>
      );
    }
  };

  return (
    <div className={`message-bubble ${isMine ? "my-bubble" : ""}`}>
      <div className="profile-wrap">
        <img src={getImg(speaker?.profileImg)} alt="프로필사진" />
      </div>
      <div className="message-content">
        <p className="speaker">{speaker?.nickname}</p>
        <div className="bubble-content-wrap">
          {message.attachmentDatas?.length > 0 && (
            <div className="attachments">
              {message.attachmentDatas.map((att, idx) =>
                renderAttachment(att, idx)
              )}
            </div>
          )}
          <p className="text">{message.content}</p>
        </div>
      </div>
      <div className="sub-info">
        {message.isModified && <p className="modified">수정됨</p>}
        <p className="created-at">{formatKoreanTime(message.createAt)}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
