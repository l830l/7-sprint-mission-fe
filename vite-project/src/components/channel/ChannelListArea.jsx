import { useEffect, useState } from "react";
import IcoButton from "../ui/IcoButton";
import Button from "../ui/Button";
import Input from "../ui/Input";
import PublicChannelList from "./PublicChannelList";
import PrivateChannelList from "./PrivateChannelList";
import apiClient from "../../api/client";
import { useUserState } from "../../context/user/UserStateContext";
import ChannelCreateModal from "../modal/ChannelCreateModal";
import { useChannelState } from "../../context/channel/ChannelStateContext";
import { useChannelDispatch } from "../../context/channel/ChannelDispatchContext";

const ChannelListArea = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [search, setSearch] = useState("");
  const [searchConfirm, setSearchConfirm] = useState("");
  const [publicChannelList, setPublicChannelList] = useState(null);
  const [privateChannelList, setPrivateChannelList] = useState(null);
  const user = useUserState();
  const { selectedChannel } = useChannelState();
  const { selectChannel } = useChannelDispatch();

  const getChannelList = () => {
    apiClient
      .get("/api/channels", {
        params: {
          searchTxt: search,
        },
        headers: {
          "X-LOGINUSER-ID": user?.userId,
        },
      })
      .then((res) => {
        setPublicChannelList(res.data.PUBLIC);
        setPrivateChannelList(res.data.PRIVATE);

        if (!selectedChannel) {
          const channel =
            (res.data.PUBLIC?.length > 0 && res.data.PUBLIC[0]) ||
            (res.data.PRIVATE?.length > 0 && res.data.PRIVATE[0]) ||
            null;

          selectChannel(channel);
        }
      });
  };

  const handleSearch = () => {
    setSearchConfirm(search);
  };
  useEffect(() => {
    if (user?.userId) {
      getChannelList();
    }
  }, [user, searchConfirm, selectedChannel]);

  return (
    <>
      <div className="channel-area">
        <div className="title-wrap">
          <p className="title">채널 목록</p>
          <div className="ico-btns-wrap">
            <IcoButton
              icoClass="bi-plus-lg"
              addClassName="btn-add-channel ico-btn-sm"
              title="채널 추가"
              onClick={openModal}
            />
          </div>
        </div>
        <div className="search-area">
          <form
            className="form-group form-group-hr form-search"
            onSubmit={(e) => {
              e.preventDefault(); // 새로고침 방지
              handleSearch();
            }}
          >
            <div className="form-group form-group-hr form-search">
              <Input id="search" value={search} setValue={setSearch} />
              <label htmlFor="search" className="visually-hidden">
                검색어 입력
              </label>
              <IcoButton
                icoClass="bi-search"
                addClassName="btn-search ico-btn-sm"
                title="채널 검색"
                onClick={handleSearch}
              />
            </div>
          </form>
        </div>
        <div className="scroll-wrap">
          <div className="channel-list-area">
            <PublicChannelList
              publicList={publicChannelList}
              searchTxt={searchConfirm}
            />
            <PrivateChannelList
              privateList={privateChannelList}
              searchTxt={searchConfirm}
            />
          </div>
        </div>
      </div>
      <ChannelCreateModal
        show={showModal}
        onClose={closeModal}
        getChannelList={getChannelList}
      />
    </>
  );
};

export default ChannelListArea;
