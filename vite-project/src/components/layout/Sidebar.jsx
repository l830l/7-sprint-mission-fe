import InfoBox from "./InfoBox";
import ChannelListArea from "../channel/ChannelListArea";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <div className="logo-wrap">
          <h1>
            <img src="/images/logo_l.svg" alt="Logo" />
          </h1>
        </div>
        <InfoBox />
        <ChannelListArea />
      </div>
    </>
  );
};

export default Sidebar;
