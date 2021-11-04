import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  showActions,
  formActions,
  authenticationActions,
  getStreamActions,
} from "../../store";
import Cookies from "universal-cookie";
import logo from "../../photos/logo-white.png";
import Register from "../Register/register";
import "./login.css";

const cookies = new Cookies();

const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.show.showModal);
  const showPassword = useSelector((state) => state.show.passwordIcon);
  const email = useSelector((state) => state.form.email);
  const password = useSelector((state) => state.form.password);
  const token = useSelector((state) => state.authenticate.token);
  const id = useSelector((state) => state.form.id);
  const streamToken = useSelector((state) => state.stream.streamToken);
  const userId = useSelector((state) => state.stream.streamUserId);
  const streamUsername = useSelector((state) => state.stream.username);
  const fullName = useSelector((state) => state.stream.fullName);
  const avatarURL = useSelector((state) => state.stream.avatarURL);
  const streamPhoneNumber = useSelector((state) => state.stream.phoneNumber);
  const hashedPassword = useSelector((state) => state.stream.hashedPassword);
  const streamPassword = useSelector((state) => state.stream.password);
  let username = "";

  const showHandler = () => {
    dispatch(showActions.showModal());
  };
  const showPasswordHandler = () => {
    dispatch(showActions.passwordIcon());
  };
  const handleEmailChanged = (e) => {
    dispatch(formActions.email(e.target.value));
  };
  const handlePasswordChanged = (e) => {
    dispatch(formActions.password(e.target.value));
  };
  const tokenHandler = (token) => {
    dispatch(authenticationActions.token(token));
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
  const handleIdChanged = (e) => {
    dispatch(formActions.id(e));
  };

  const submit = (event) => {
    event.preventDefault();
    // loadingHandler();
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAcUSoG5Y93hsifS17N9wgXIMstnVwlnCQ",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    )
      .then((response) => {
        // loadingHandler();
        if (response.ok) {
          console.log("auth ok");
          return response.json();
        } else {
          return response.json().then((data) => {
            let errorMessage = "Authentication failed!";
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        tokenHandler(data.idToken);
        localStorage.setItem("userIsLoggedIn", data.idToken);
        localStorage.setItem("email", email);
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
            console.log(userProfile);
            username = userProfile.displayName;
            handleIdChanged(userId);
            fetch("https://chatster-backend.herokuapp.com/auth/login", {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            })
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                console.log(data);
                cookies.set("streamToken", data.token);
                cookies.set("streamUserId", data.userId);
                cookies.set("username", data.username);
                cookies.set("fullName", data.fullName);
                cookies.set("avatarURL", data.avatarURL);
                cookies.set("phoneNumber", data.phoneNumber);
                cookies.set("hashedPassword", data.hashedPassword);
                cookies.set("password", data.password);
                if (!userProfile.getStream) {
                  fetch(
                    `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/getStream.json`,
                    {
                      method: "post",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        streamToken: data.token,
                        streamUserId: data.userId,
                        username: data.username,
                        fullName: data.fullName,
                        avatarURL: data.avatarURL,
                        phoneNumber: data.phoneNumber,
                        hashedPassword: data.hashedPassword,
                        password: data.password,
                      }),
                    }
                  );
                }
              });
            setTimeout(function () {
              history.replace("/");
            }, 3000);
          });
      });
  };

  return (
    <div>
      <div transition-style className="splash-screen">
        <p className="app-title">Chatster</p>
        <img alt="logo" className="app-logo" src={logo} />
        <form className="rounded flex justify-center flex-col items-center	">
          {!showModal ? (
            <>
              <p className="form-title">Chatster</p>
              <img alt="logo" className="form-logo h-1/3" src={logo} />
              <input
                type="email"
                name="email"
                onChange={handleEmailChanged}
                className="rounded m-5 bg-transparent border-2 border-white w-3/5 "
                placeholder="Email"
              />
              <input
                type={!showPassword ? "password" : "text"}
                name="password"
                onChange={handlePasswordChanged}
                className="rounded m-5 bg-transparent border-2 border-white w-3/5 "
                placeholder="Password"
                id="password"
              />
              {!showPassword ? (
                <>
                  <i
                    class="fas fa-eye-slash icon"
                    onClick={showPasswordHandler}
                  ></i>
                </>
              ) : (
                <>
                  <i class="fas fa-eye icon" onClick={showPasswordHandler}></i>
                </>
              )}
              <button className="border-2 rounded w-3/5 mb-4" onClick={submit}>
                {" "}
                Login
              </button>
            </>
          ) : (
            <>
              {" "}
              <Register />
            </>
          )}
          <p>
            {!showModal ? (
              <>
                Don't have an account?
                <span onClick={showHandler}>Sign up</span>
              </>
            ) : (
              <>
                Already have an account?
                <span onClick={showHandler}> Sign In</span>
              </>
            )}
          </p>
          <p>
            Sign in as a<span className="sign-up"> Demo User</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
