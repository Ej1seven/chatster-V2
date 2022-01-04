import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../src/pages/Login/login";
import Home from "../src/pages/Home/home";
import Search from "../src/pages/Search/search";
import View from "../src/pages/View/view";
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
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
import { ChannelContainer, ChannelListContainer } from "./components/Channel";
import "./App.css";
import "stream-chat-react/dist/css/index.css";

const apiKey = "wsrkmp4su547";

const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();

const authToken = cookies.get("streamToken");

function App() {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
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
  const displayHome = useSelector((state) => state.show.displayHome);
  const displaySearch = useSelector((state) => state.show.displaySearch);
  const displayViewProfile = useSelector(
    (state) => state.show.displayViewProfile
  );

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
  const following = (e) => {
    dispatch(formActions.following(e));
  };
  const followers = (e) => {
    dispatch(formActions.followers(e));
  };
  const handleUneditedUserListChanged = (e) => {
    dispatch(formActions.uneditedUserList(e));
  };
  const handleUneditedFollowingListChanged = (e) => {
    dispatch(formActions.uneditedFollowingList(e));
  };
  const handleUserListChanged = (e) => {
    dispatch(formActions.usersList(e));
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
  const handlePhotoGalleryList = (e) => {
    dispatch(uploadImageActions.photoGalleryList(e));
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
  const isCreatingHandler = (value) => {
    dispatch(getStreamChannelActions.isCreating(value));
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

    if (isUserLogin) {
      handleEmailChanged(email);
      tokenHandler(isUserLogin);
    }
  }, [token]);

  if (isLoggedIn) {
    fetch(
      "https://chat-application-db-default-rtdb.firebaseio.com/profile.json"
    )
      .then((response) => response.json())
      .then((data) => {
        let usersArray = [];
        let users = Object.entries(data).map((key) => {
          return key;
        });
        handleUneditedUserListChanged(users);
        let formattedUserList = users.filter(
          (userProfile) => userProfile[1].email !== email
        );
        for (var j = 0; j < formattedUserList.length; j++) {
          usersArray.push(formattedUserList[j][1]);
        }

        let alphabetizedUserList = usersArray.sort((a, b) =>
          a.displayName > b.displayName ? 1 : -1
        );

        handleUserListChanged(alphabetizedUserList);
        let user = users.filter((user) => user[1].email === email);
        let userProfile = user[0][1];
        let userId = user[0][0];
        let getStream = user[0][1].getStream;
        if (getStream) {
          let getStreamData = Object.entries(getStream).map((key) => {
            return key;
          });
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
        fetch(
          `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/following.json`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              let followingUsers = [];
              let uneditedFollowingUsers;
              let formattedData = Object.entries(data).map((key) => {
                return key;
              });

              for (var j = 0; j < formattedData.length; j++) {
                followingUsers.push(formattedData[j][1]);
              }
              following(followingUsers);
              let uneditedFollowingList = [];
              for (var j = 0; j < usersArray.length; j++) {
                let followingUserProfile = usersArray.filter(
                  (user) => user.email === followingUsers[j]
                );

                if (followingUserProfile.length > 0) {
                  uneditedFollowingList.push(followingUserProfile);
                }
              }
              let alphabetizedFollowingList = uneditedFollowingList.sort(
                (a, b) => (a[0].displayName > b[0].displayName ? 1 : -1)
              );
              handleUneditedFollowingListChanged(alphabetizedFollowingList);
            }
          });
        fetch(
          `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/followers.json`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              let followerUsers = [];
              let formattedData = Object.entries(data).map((key) => {
                return key;
              });

              for (var j = 0; j < formattedData.length; j++) {
                followerUsers.push(formattedData[j][1]);
              }
              followers(followerUsers);
            }
          });
        fetch(
          `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/photoGallery.json`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              let photos = [];
              let formattedData = Object.entries(data).map((key) => {
                return key;
              });

              for (var j = 0; j < formattedData.length; j++) {
                photos.push(formattedData[j][1]);
              }
              handlePhotoGalleryList(photos);
              // followers(followerUsers);
            }
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
      });
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
          {isLoggedIn && displayHome && <Home />}
          {displaySearch && <Search />}
          {displayViewProfile && <View />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
