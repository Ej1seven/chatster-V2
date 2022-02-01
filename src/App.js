import React, { useEffect } from "react";
//Imported routing components from react-router-dom
import { Switch, Route } from "react-router-dom";
//Importing pages that can be accessed through react router
import Login from "../src/pages/Login/login";
import Home from "../src/pages/Home/home";
import Search from "../src/pages/Search/search";
import View from "../src/pages/View/view";
//Importing header
import Header from "./components/Header/header";
//Importing Redux components
import { useSelector, useDispatch } from "react-redux";
import {
  //reducer used to import user/export profile data
  formActions,
  //reducer used to import/export images
  uploadImageActions,
  //reducer used to import/export user profile data in Stream
  getStreamActions,
  //reducer used when manipulating channels in Stream
  getStreamChannelActions,
  //reducer used when authenticating users
  authenticationActions,
} from "./store/index";
//imports Chat services from the Stream API
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { ChannelContainer, ChannelListContainer } from "./components/Channel";
//Importing cookies which will be used to set the properties needed to connect to the Stream API
import Cookies from "universal-cookie";
import { css } from "@emotion/react";
import "./App.css";
import "stream-chat-react/dist/css/index.css";
//apiKey is used to create an instance for the client to use Stream
const apiKey = "zge5f39fgjv7";
//client StreamChat instance
const client = StreamChat.getInstance(apiKey);
//cookies will be used to set the properties needed to connect to the Stream API
const cookies = new Cookies();
//the token received from the server after the user has successfully logged into the Stream API
const authToken = cookies.get("streamToken");

function App() {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  //Hook used to access the redux store and make changes to state
  const dispatch = useDispatch();
  //Token provided bu Firebase Authentication once the user has successfully logged in
  const token = useSelector((state) => state.authenticate.token);
  //Email provided by the user at login
  const email = useSelector((state) => state.form.email);
  //Used to determine if the user is creating or editing a new channel
  const isCreating = useSelector((state) => state.channel.isCreating);
  const isEditing = useSelector((state) => state.channel.isEditing);
  //Used to determine if the user is creating a direct message or group message
  const createType = useSelector((state) => state.channel.createType);
  //toggles the sidebar
  const display = useSelector((state) => state.show.displayComponent);
  //toggles the homepage
  const displayHome = useSelector((state) => state.show.displayHome);
  //toggles the friends page
  const displaySearch = useSelector((state) => state.show.displaySearch);
  //toggles the view user profile page
  const displayViewProfile = useSelector(
    (state) => state.show.displayViewProfile
  );
  //checks if token value is true in the redux store
  //If the token value is true then the user is automatically logged in
  const isLoggedIn = !!token;
  //updated the users display name in redux store
  const handleDisplayNameChanged = (e) => {
    dispatch(formActions.displayName(e));
  };
  //updated the users first name in redux store
  const handleFirstNameChanged = (e) => {
    dispatch(formActions.firstName(e));
  };
  //updated the users last name in redux store
  const handleLastNameChanged = (e) => {
    dispatch(formActions.lastName(e));
  };
  //updated the users id in redux store
  const handleIdChanged = (e) => {
    dispatch(formActions.id(e));
  };
  //updated the users following list in redux store
  const following = (e) => {
    dispatch(formActions.following(e));
  };
  //updated the users followers list in redux store

  const followers = (e) => {
    dispatch(formActions.followers(e));
  };
  //list of all the users in the database in raw form
  const handleUneditedUserListChanged = (e) => {
    dispatch(formActions.uneditedUserList(e));
  };
  //list of all the users the current user is following in the database in raw form
  const handleUneditedFollowingListChanged = (e) => {
    dispatch(formActions.uneditedFollowingList(e));
  };
  //list of all the users in alphabetized order
  const handleUserListChanged = (e) => {
    dispatch(formActions.usersList(e));
  };
  //Adds the users profile photo url to redux store
  const handleProfilePhoto = (e) => {
    dispatch(uploadImageActions.profileUrl(e));
  };
  //Adds the users profile id to redux store
  const handleProfileId = (e) => {
    dispatch(uploadImageActions.photoId(e));
  };
  //Adds all the users profile ids to redux store
  const handleProfileIds = (e) => {
    dispatch(uploadImageActions.photoIds(e));
  };
  //Add the total number of user profiles to redux store
  const handleProfileCount = (e) => {
    dispatch(uploadImageActions.photoCount(e));
  };
  //Adds all the users photos urls to redux store
  const handlePhotoGalleryList = (e) => {
    dispatch(uploadImageActions.photoGalleryList(e));
  };
  //Adds the data used by the Stream API to redux store
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
  //Changes the create type to either direct or group
  const createTypeHandler = (createType) => {
    dispatch(getStreamChannelActions.createType(createType));
  };
  //Determines if the user is creating a new channel or not
  const isCreatingHandler = (value) => {
    dispatch(getStreamChannelActions.isCreating(value));
  };
  //Determines if the user is editing a existing channel or not
  const isEditingHandler = () => {
    dispatch(getStreamChannelActions.isEditing());
  };
  //Adds the token provided by Firebase Authentication to the database
  const tokenHandler = (token) => {
    dispatch(authenticationActions.token(token));
  };
  //updates the users email in redux store
  const handleEmailChanged = (e) => {
    dispatch(formActions.email(e));
  };
  //When the App.js file is mounted or updated the useffect hook is ran to check
  //for the token in local storage
  useEffect(() => {
    let isUserLogin = localStorage.getItem("accountToken");
    let email = localStorage.getItem("email");
    //if the token is in localStorage the tokenhandler() adds the token to redux store
    //which in turn logs the user in
    if (isUserLogin) {
      handleEmailChanged(email);
      tokenHandler(isUserLogin);
    }
  }, [token]);
  //once the user is logged in multiple fetch request are sent to Firebase Realtime Database pulling the users profile data
  if (isLoggedIn) {
    //this fetch request pulls all the profiles from the database
    fetch(
      "https://chat-application-db-default-rtdb.firebaseio.com/profile.json"
    )
      .then((response) => response.json())
      .then((data) => {
        //when the profiles are first pulled from the database the data is presented as one object filled multiple objects
        let usersArray = [];
        //this function separates all the objects and puts them into an array for easier use later on
        let users = Object.entries(data).map((key) => {
          return key;
        });
        //this function stores the users array in the redux store
        handleUneditedUserListChanged(users);
        //formattedUserList provides an array of all the users not including current user that is signed in
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
