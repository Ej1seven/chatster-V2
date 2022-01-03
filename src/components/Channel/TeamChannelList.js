import React from "react";
import { showActions } from "../../store/index";
import { useDispatch } from "react-redux";
import photo from "../../photos/refresh-page-option.png";

const AddChannel = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  setToggleContainer,
  createType,
  closeSidebar,
}) => {
  let dispatch = useDispatch();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => {
        const removeHomeDisplay = (value) => {
          dispatch(showActions.displayHome(value));
        };

        const toggleDisplay = (value) => {
          dispatch(showActions.displayComponent(value));
        };
        console.log(createType);
        setCreateType(createType);
        setIsCreating((prevState) => !prevState);
        setIsEditing(false);
        toggleDisplay(true);
        removeHomeDisplay(false);
        closeSidebar(false);
        if (setToggleContainer) setToggleContainer((prevState) => !prevState);
      }}
    >
      <path
        d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM11 7.5H7.5V11H6.5V7.5H3V6.5H6.5V3H7.5V6.5H11V7.5Z"
        fill="white"
        fillOpacity="0.66"
      />
    </svg>
  );
};

const TeamChannelList = ({
  children,
  error = false,
  loading,
  type,
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer,
  closeSidebar,
}) => {
  if (error) {
    return type === "team" ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Connection error, please click the refresh button to reload your
          chats. If the connection error persist, please logout then log back
          end.
        </p>
        <img
          src={photo}
          className="w-12 m-auto	mt-8"
          onClick={() => window.location.reload()}
        ></img>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === "team" ? "Channels" : "Messages"} loading...
        </p>
      </div>
    );
  }

  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === "team" ? "Channels" : "Direct Messages"}
        </p>
        <AddChannel
          createType={type === "team" ? "team" : "messaging"}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
          closeSidebar={closeSidebar}
        />
      </div>
      <div className="connection-list-text">{children}</div>
    </div>
  );
};

export default TeamChannelList;
