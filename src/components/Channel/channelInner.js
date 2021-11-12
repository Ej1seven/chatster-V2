import React, { useState } from "react";
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";

export const GiphyContext = React.createContext({});

const ChannelInfo = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.16602 6.49837H9.83269V4.83171H8.16602V6.49837ZM8.99936 15.665C5.32351 15.665 2.33268 12.6743 2.33268 8.99833C2.33268 5.32253 5.32351 2.33171 8.99936 2.33171C12.6752 2.33171 15.666 5.32253 15.666 8.99833C15.666 12.6743 12.6752 15.665 8.99936 15.665ZM8.99936 0.665039C4.39684 0.665039 0.666016 4.39587 0.666016 8.99833C0.666016 13.6009 4.39684 17.3317 8.99936 17.3317C13.6019 17.3317 17.3327 13.6009 17.3327 8.99833C17.3327 4.39587 13.6019 0.665039 8.99936 0.665039ZM8.16602 13.165H9.83269V8.165H8.16602V13.165Z"
      fill="#ffffff"
      fillOpacity="0.33"
    />
  </svg>
);

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }

    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: "flex", width: "100%" }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();

  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );
    const additionalMembers = members.length - 3;

    if (channel.type === "messaging") {
      return (
        <div className="team-channel-header__name-wrapper">
          {members.map(({ user }, i) => (
            <div key={i} className="team-channel-header__name-multi">
              <Avatar
                image={user.image}
                name={user.fullName || user.id}
                size={32}
              />
              <p className="team-channel-header__name user">
                {user.fullName || user.id}
              </p>
            </div>
          ))}

          {additionalMembers > 0 && (
            <p className="team-channel-header__name user">
              and {additionalMembers} more
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="team-channel-header__channel-wrapper">
        <p className="team-channel-header__name"># {channel.data.name}</p>
        <span style={{ display: "flex" }} onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    );
  };

  const getWatcherText = (watchers) => {
    if (!watchers) return "No users online";
    if (watchers === 1) return "1 user online";
    return `${watchers} users online`;
  };

  return (
    <div className="team-channel-header__container">
      <MessagingHeader />
      <div className="team-channel-header__right">
        <div>
          <p className="team-channel-header__right-text">
            {getWatcherText(watcher_count)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelInner;
