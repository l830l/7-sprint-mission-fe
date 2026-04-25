import { useState, useRef } from "react";
import IcoButton from "../ui/IcoButton";
import Input from "../ui/Input";
import apiClient from "../../api/client";
import { useUserState } from "../../context/user/UserStateContext";
import { useChannelState } from "../../context/channel/ChannelStateContext";

const MessageInputArea = ({ loadMessage }) => {
  const [inputMsg, setInputMsg] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const user = useUserState();
  const { selectedChannel } = useChannelState();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filesWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...filesWithPreview]);
    e.target.value = null; // 같은 파일 재첨부 허용
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!inputMsg.trim() && attachments.length === 0) return;
    if (!selectedChannel) alert("채널을 먼저 생성해주세요");

    try {
      const formData = new FormData();
      formData.append(
        "messageInfoReq",
        new Blob([JSON.stringify({ content: inputMsg })], {
          type: "application/json",
        }),
      );
      attachments.forEach(({ file }) =>
        formData.append("attachmentFiles", file),
      );

      await apiClient.post("/api/messages", formData, {
        headers: {
          "X-LOGINUSER-ID": user.userId,
          "Content-Type": "multipart/form-data",
        },
        params: { channelId: selectedChannel.channelId },
      });

      setInputMsg("");
      setAttachments([]);
      loadMessage();
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className="message-input-area">
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <IcoButton
          icoClass="bi-plus-lg"
          addClassName="btn-add-attachment"
          title="첨부파일 추가"
          onClick={() => fileInputRef.current.click()}
        />
        <Input
          id="message"
          placeholder="메세지 입력"
          value={inputMsg}
          setValue={setInputMsg}
          validation={{
            required: true,
            minLength: 1,
          }}
          onKeyPress={handleKeyPress}
        />
        <IcoButton
          icoClass="bi-send-fill"
          addClassName="btn-msg-send"
          title="메세지 전송"
          onClick={sendMessage}
        />
        <div className="attachment-area">
          {attachments.length > 0 && (
            <div className="attachments-preview">
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  className="attachment-item position-relative me-2"
                >
                  <img src={att.preview} alt="attachment" className="rounded" />
                  <div className="button-wrap">
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => removeAttachment(idx)}
                    ></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageInputArea;
