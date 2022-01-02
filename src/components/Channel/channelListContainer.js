import React, { useState, useEffect } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { useSelector, useDispatch, connect } from "react-redux";
import { authenticationActions, showActions } from "../../store/index";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from "./";
import logo from "../../photos/logo-black-min.png";
import "./channelList.css";

const cookies = new Cookies();

const chatIcon = document.querySelector(".sidebar-tab");

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
    <div className="channel-list__header__text">
      {" "}
      <p>Connections</p>
    </div>
    <div className="icon-container">
      <i class="far fa-window-close fa-2x" onClick={closeSidebar}></i>
    </div>
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
  console.log(client);
  const dispatch = useDispatch();
  const displayBasePage = useSelector((state) => state.show.displayHomeBase);

  const removeToken = () => {
    dispatch(authenticationActions.token());
  };
  const toggleDisplay = (value) => {
    dispatch(showActions.displayComponent(value));
  };
  const homeDisplay = (value) => {
    dispatch(showActions.displayHome(value));
  };
  const searchDisplay = (value) => {
    dispatch(showActions.displaySearch(value));
  };

  const logout = () => {
    const apiKey = "hz6p2252afpv";
    const client = StreamChat.getInstance(apiKey);
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
    client.disconnectUser();
    window.location.reload();
  };

  useEffect(() => {
    toggleDisplay(false);
  }, [displayBasePage]);

  const closeSidebar = () => {
    setSidebar(false);
    toggleDisplay(false);
    homeDisplay(true);
    setIsCreating(false);
    setIsEditing(false);
  };
  const filters = { members: { $in: [client.userID] } };
  const SidebarTab = () => (
    // <div className="sidebar-tab" onClick={openSidebar}>
    <div>
      <i
        class="fab fa-facebook-messenger sidebar-tab fa-2x"
        onClick={openSidebar}
      ></i>
    </div>
  );
  const [sidebar, setSidebar] = useState(false);
  const openSidebar = () => {
    setSidebar(true);
    toggleDisplay(false);
    homeDisplay(false);
    searchDisplay(false);
    setIsCreating(false);
    setIsEditing(false);
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
                closeSidebar={setSidebar}
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                type="team"
                setIsCreating={setIsCreating}
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
                closeSidebar={setSidebar}
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
                closeSidebar={setSidebar}
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                type="messaging"
                setToggleContainer={setToggleContainer}
                setIsCreating={setIsCreating}
                setIsEditing={setIsEditing}
                closeSidebar={setSidebar}
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
