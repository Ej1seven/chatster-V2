import { Switch, Route } from "react-router-dom";
import Login from "../src/pages/Login/login";
import Home from "../src/pages/Home/home";
import Header from "./components/Header/header";
import { useSelector, useDispatch, connect } from "react-redux";
import { formActions, uploadImageActions } from "./store/index";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { ChannelContainer, ChannelListContainer } from "./components/Channel";
import "./App.css";

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

  const apiKey = "khvc6fsuwcd3";

  const client = StreamChat.getInstance(apiKey);
  const serverClient = connect();

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
        console.log(id);
        // console.log(photoIds[0]);
      });
    client.connectUser(
      {
        id: id,
        name: displayName,
        fullName: `${firstName} ${lastName}`,
        image: profileUrlFinal,
        hashedPassword: password,
        phoneNumber: phoneNumber,
      },
      token
    );
  }

  return (
    <div className={`app ${isLoggedIn && "background"}`}>
      {isLoggedIn && <Header />}
      {isLoggedIn && (
        <Chat client={client} theme="team light">
          <ChannelListContainer></ChannelListContainer>
          <ChannelContainer></ChannelContainer>
        </Chat>
      )}
      <Switch>
        <Route path="/">
          {!isLoggedIn && <Login />}
          {isLoggedIn && <Home />}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
