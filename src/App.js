import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../src/pages/Login/login";
import Home from "../src/pages/Home/home";
import Header from "./components/Header/header";
import { useSelector, useDispatch, connect } from "react-redux";
import {
  formActions,
  uploadImageActions,
  getStreamActions,
  getStreamChannelActions,
  authenticationActions,
} from "./store/index";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { ChannelContainer, ChannelListContainer } from "./components/Channel";
import "./App.css";
import "stream-chat-react/dist/css/index.css";

const apiKey = "yzq768xf9r3a";

const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();

const authToken = cookies.get("streamToken");

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authenticate.token);
  const email = useSelector((state) => state.form.email);
  const photoCount = useSelector((state) => state.uploadImage.photoCount);
  const profileUrl = useSelector((state) => state.uploadImage.profileUrlFinal);
  const displayName = useSelector((state) => state.form.displayName);
  const profileUrlFinal = useSelector(
    (state) => state.uploadImage.profileUrlFinal
  );
  const id = useSelector((state) => state.form.id);
  const phoneNumber = useSelector((state) => state.form.phoneNumber);
  const firstName = useSelector((state) => state.form.firstName);
  const lastName = useSelector((state) => state.form.lastName);
  const password = useSelector((state) => state.form.password);
  const streamToken = useSelector((state) => state.stream.streamToken);
  const userId = useSelector((state) => state.stream.streamUserId);
  const username = useSelector((state) => state.stream.username);
  const fullName = useSelector((state) => state.stream.fullName);
  const avatarURL = useSelector((state) => state.stream.avatarURL);
  const streamPhoneNumber = useSelector((state) => state.stream.phoneNumber);
  const hashedPassword = useSelector((state) => state.stream.hashedPassword);
  const isCreating = useSelector((state) => state.channel.isCreating);
  const isEditing = useSelector((state) => state.channel.isEditing);
  const createType = useSelector((state) => state.channel.createType);
  const display = useSelector((state) => state.show.displayComponent);

  const isLoggedIn = !!token;
  const handleDisplayNameChanged = (e) => {
    dispatch(formActions.displayName(e));
  };
  const handleFirstNameChanged = (e) => {
    dispatch(formActions.firstName(e));
  };
  const handleLastNameChanged = (e) => {
    dispatch(formActions.lastName(e));
  };
  const handleIdChanged = (e) => {
    dispatch(formActions.id(e));
  };
  const handleProfilePhoto = (e) => {
    dispatch(uploadImageActions.profileUrl(e));
  };
  const handleProfileId = (e) => {
    dispatch(uploadImageActions.photoId(e));
  };
  const handleProfileIds = (e) => {
    dispatch(uploadImageActions.photoIds(e));
  };
  const handleProfileCount = (e) => {
    dispatch(uploadImageActions.photoCount(e));
  };
  const streamTokenHandler = (streamToken) => {
    dispatch(getStreamActions.streamToken(streamToken));
  };
  const streamUserIdHandler = (streamUserId) => {
    dispatch(getStreamActions.streamUserId(streamUserId));
  };
  const usernameHandler = (username) => {
    dispatch(getStreamActions.username(username));
  };
  const fullNameHandler = (fullName) => {
    dispatch(getStreamActions.fullName(fullName));
  };
  const avatarURLHandler = (avatarURL) => {
    dispatch(getStreamActions.avatarURL(avatarURL));
  };
  const phoneNumberHandler = (phoneNumber) => {
    dispatch(getStreamActions.phoneNumber(phoneNumber));
  };
  const hashedPasswordHandler = (hashedPassword) => {
    dispatch(getStreamActions.hashedPassword(hashedPassword));
  };
  const passwordHandler = (password) => {
    dispatch(getStreamActions.password(password));
  };
  const createTypeHandler = (createType) => {
    dispatch(getStreamChannelActions.createType(createType));
  };
  const isCreatingHandler = () => {
    dispatch(getStreamChannelActions.isCreating());
  };
  const isEditingHandler = () => {
    dispatch(getStreamChannelActions.isEditing());
  };
  const tokenHandler = (token) => {
    dispatch(authenticationActions.token(token));
  };
  const handleEmailChanged = (e) => {
    dispatch(formActions.email(e));
  };

  useEffect(() => {
    let isUserLogin = localStorage.getItem("userIsLoggedIn");
    let email = localStorage.getItem("email");
    console.log(isUserLogin);
    if (isUserLogin) {
      handleEmailChanged(email);
      tokenHandler(isUserLogin);
    }
  }, [token]);

  if (isLoggedIn) {
    console.log(token);
    fetch(
      "https://chat-application-db-default-rtdb.firebaseio.com/profile.json"
    )
      .then((response) => response.json())
      .then((data) => {
        let users = Object.entries(data).map((key) => {
          return key;
        });
        let user = users.filter((user) => user[1].email === email);
        let userProfile = user[0][1];
        let userId = user[0][0];
        let getStream = user[0][1].getStream;
        console.log(getStream);
        if (getStream) {
          let getStreamData = Object.entries(getStream).map((key) => {
            return key;
          });
          console.log(getStreamData[0][1].fullName);
          streamTokenHandler(getStreamData[0][1].streamToken);
          streamUserIdHandler(getStreamData[0][1].streamUserId);
          usernameHandler(getStreamData[0][1].username);
          fullNameHandler(getStreamData[0][1].fullName);
          avatarURLHandler(getStreamData[0][1].fullName);
          phoneNumberHandler(getStreamData[0][1].phoneNumber);
          hashedPasswordHandler(getStreamData[0][1].hashedPassword);
        }
        let photoUrl;
        let photoIds = [];
        let count = 0;
        if ((count = 1)) {
          for (let photo in userProfile.profilePhoto) {
            photoIds.push(photo);
            photoUrl = userProfile.profilePhoto[photo];
            count++;
            console.log(photoIds);
          }
        } else {
          photoUrl = null;
        }
        handleDisplayNameChanged(userProfile.displayName);
        handleFirstNameChanged(userProfile.firstName);
        handleLastNameChanged(userProfile.lastName);
        handleIdChanged(userId);
        handleProfilePhoto(photoUrl);
        handleProfileId(photoIds[0]);
        handleProfileIds(photoIds);
        handleProfileCount(count);
      });
    if (authToken) {
      client.connectUser(
        {
          id: cookies.get("streamUserId"),
          name: cookies.get("username"),
          fullName: cookies.get("fullName"),
          image: cookies.get("avatarURL"),
          hashedPassword: cookies.get("hashedPassword"),
          phoneNumber: cookies.get("phoneNumber"),
        },
        authToken
      );
    }
  }

  return (
    <div className={`app ${isLoggedIn && "background"}`}>
      {isLoggedIn && <Header />}
      {isLoggedIn && (
        <Chat client={client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={isCreatingHandler}
            setCreateType={createTypeHandler}
            setIsEditing={isEditingHandler}
          ></ChannelListContainer>
          {display && (
            <ChannelContainer
              isCreating={isCreating}
              setIsCreating={isCreatingHandler}
              isEditing={isEditing}
              setIsEditing={isEditingHandler}
              createType={createType}
            ></ChannelContainer>
          )}
        </Chat>
      )}
      <Switch>
        <Route path="/">
          {!isLoggedIn && <Login />}
          {isLoggedIn && display && <Home />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
