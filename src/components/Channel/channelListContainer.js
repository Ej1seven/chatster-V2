import React, { useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { useSelector, useDispatch, connect } from "react-redux";
import { authenticationActions, showActions } from "../../store/index";
import Cookies from "universal-cookie";
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from "./";
import logo from "../../photos/logo-black-min.png";
import "./channelList.css";

const cookies = new Cookies();

const SideBar = ({ logout }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon1">
      <div className="icon1__inner">
        <img src={logo} alt="Hospital" width="30" />
      </div>
    </div>
    <div className="channel-list__sidebar__icon2">
      <div className="icon1__inner" onClick={logout}>
        <i
          class="fas fa-sign-out-alt fa-lg sign-out_button"
          alt="Logout"
          width="30"
        ></i>
      </div>
    </div>
  </div>
);

const CompanyHeader = ({ closeSidebar }) => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">
      Medical Pager
      <i class="far fa-window-close fa-2x" onClick={closeSidebar}></i>
    </p>
  </div>
);

const customChannelTeamFilter = (channels) => {
  return channels.filter((channel) => channel.type === "team");
};

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === "messaging");
};

const ChannelListContent = ({
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer,
}) => {
  const { client } = useChatContext();
  const dispatch = useDispatch();

  const removeToken = () => {
    dispatch(authenticationActions.token());
  };
  const toggleDisplay = () => {
    dispatch(showActions.displayComponent());
  };

  const logout = () => {
    // cookies.remove("streamToken");
    // cookies.remove("streamUserId");
    // cookies.remove("username");
    // cookies.remove("fullName");
    // cookies.remove("avatarURL");
    // cookies.remove("hashedPassword");
    // cookies.remove("phoneNumber");
    // cookies.remove("password");
    removeToken();
    localStorage.removeItem("userIsLoggedIn");
    localStorage.removeItem("email");
    window.location.reload();
  };

  const closeSidebar = () => {
    setSidebar(false);
    toggleDisplay();
  };
  const filters = { members: { $in: [client.userID] } };
  const SidebarTab = () => (
    <div className="sidebar-tab" onClick={openSidebar}></div>
  );
  const [sidebar, setSidebar] = useState(false);
  const openSidebar = () => {
    setSidebar(true);
    toggleDisplay();
  };
  if (sidebar) {
    return (
      <div className="sidebar-container ">
        <SideBar logout={logout} />
        <div className="channel-list__list__wrapper ">
          <CompanyHeader closeSidebar={closeSidebar} />
          <ChannelSearch setToggleContainer={setToggleContainer} />
          <ChannelList
            filters={filters}
            channelRenderFilterFn={customChannelTeamFilter}
            List={(listProps) => (
              <TeamChannelList
                {...listProps}
                type="team"
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                setCreateType={setCreateType}
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                type="team"
                setIsCreating={setIsCreating}
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            )}
          />
          <ChannelList
            filters={filters}
            channelRenderFilterFn={customChannelMessagingFilter}
            List={(listProps) => (
              <TeamChannelList
                {...listProps}
                type="messaging"
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                setCreateType={setCreateType}
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                type="messaging"
                setToggleContainer={setToggleContainer}
                setIsCreating={setIsCreating}
                setIsEditing={setIsEditing}
              />
            )}
          />
        </div>
      </div>
    );
  } else {
    return <SidebarTab />;
  }
};

const ChannelListContainer = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
}) => {
  const [toggleContainer, setToggleContainer] = useState(false);

  return (
    <>
      <div className="channel-list__container">
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
      </div>

      <div
        className="channel-list__container-responsive"
        style={{
          left: toggleContainer ? "0%" : "-89%",
          backgroundColor: "#005fff",
        }}
      >
        <div
          className="channel-list__container-toggle"
          onClick={() =>
            setToggleContainer((prevToggleContainer) => !prevToggleContainer)
          }
        ></div>
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
        />
      </div>
    </>
  );
};

export default ChannelListContainer;
