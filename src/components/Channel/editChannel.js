import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";

import { UserList } from "./";

const CloseCreateChannel = ({ setIsCreating, setIsEditing }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={() => {
      if (setIsCreating) setIsCreating(false);
      if (setIsEditing) setIsEditing(false);
    }}
  >
    <path
      d="M6.10042 6.10051C0.633603 11.5673 0.633603 20.4327 6.10042 25.8995C11.5672 31.3663 20.4326 31.3663 25.8994 25.8995C31.3662 20.4327 31.3662 11.5673 25.8994 6.10051C20.4326 0.633686 11.5672 0.633685 6.10042 6.10051ZM22.3639 11.0503L17.4141 16L22.3639 20.9497L20.9497 22.364L15.9999 17.4142L11.0502 22.364L9.63596 20.9497L14.5857 16L9.63596 11.0503L11.0502 9.63604L15.9999 14.5858L20.9497 9.63604L22.3639 11.0503Z"
      fill="var(--primary-color)"
    />
  </svg>
);

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();

    setChannelName(event.target.value);
  };

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input
        value={channelName}
        onChange={handleChange}
        placeholder="channel-name"
      />
      <p>Add Members</p>
    </div>
  );
};

const EditChannel = ({ setIsEditing }) => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

    if (nameChanged) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  };

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChannelNameInput
        channelName={channelName}
        setChannelName={setChannelName}
      />
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className="edit-channel__button-wrapper btn" onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
};

export default EditChannel;
