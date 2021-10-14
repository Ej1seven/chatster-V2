import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { showActions, formActions, authenticationActions } from "../../store";
import logo from "../../photos/logo-white.png";
import Register from "../Register/register";
import "./login.css";

const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const showModal = useSelector((state) => state.show.showModal);
  const showPassword = useSelector((state) => state.show.passwordIcon);
  const email = useSelector((state) => state.form.email);
  const password = useSelector((state) => state.form.password);
  const token = useSelector((state) => state.authenticate.token);

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
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
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
