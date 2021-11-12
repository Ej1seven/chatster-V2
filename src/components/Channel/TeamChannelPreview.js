import React from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { useDispatch } from "react-redux";
import { showActions } from "../../store/index";

const TeamChannelPreview = ({
  setActiveChannel,
  setIsCreating,
  setIsEditing,
  channel,
  type,
  setToggleContainer,
  closeSidebar,
}) => {
  const { channel: activeChannel, client } = useChatContext();
  const dispatch = useDispatch();

  const removeHomeDisplay = (value) => {
    dispatch(showActions.displayHome(value));
  };

  const toggleDisplay = (value) => {
    dispatch(showActions.displayComponent(value));
  };
  const ChannelPreview = () => (
    <p className="channel-preview__item">
      # {channel?.data?.name || channel?.data?.id}
    </p>
  );

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );

    console.log(members[0]);

    return (
      <div className="channel-preview__item single">
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.fullName || members[0]?.user?.id}
          size={24}
        />
        <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
      </div>
    );
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? "channel-preview__wrapper__selected"
          : "channel-preview__wrapper"
      }
      onClick={() => {
        console.log(channel);
        setIsCreating(false);
        setIsEditing(false);
        setActiveChannel(channel);
        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
        toggleDisplay(true);
        closeSidebar(false);
        removeHomeDisplay(false);
      }}
    >
      {type === "team" ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};

export default TeamChannelPreview;
