import { React, useEffect, useState } from "react";
import { database } from "../../firebase/index";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { formActions, showActions } from "../../store/index";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";

import "./search.css";

const Search = () => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const dispatch = useDispatch();
  const email = useSelector((state) => state.form.email);
  const userList = useSelector((state) => state.form.usersList);
  const uneditedUserList = useSelector((state) => state.form.uneditedUserList);
  const uneditedFollowingList = useSelector(
    (state) => state.form.uneditedFollowingList
  );
  const userId = useSelector((state) => state.form.id);
  const following = useSelector((state) => state.form.following);
  const followers = useSelector((state) => state.form.followers);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  const [peopleDisplay, setpeopleDisplay] = useState(true);
  const [followingDisplay, setfollowingDisplay] = useState(false);
  const [followerDisplay, setfollowerDisplay] = useState(false);
  const [modal, setModal] = useState(false);
  let followerUserId;
  let [modalPrompt, setModalPrompt] = useState("");
  let [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let isFollowingStatus = "";
  let peopleElement = document.getElementById("people-tab");
  let followingElement = document.getElementById("following-tab");
  let followerElement = document.getElementById("follower-tab");
  let userInput = document.querySelector("#user-input");
  let userContainer = document.querySelector("#user-container");
  const guest = (e) => {
    dispatch(formActions.guestUser(e));
  };
  const displayViewProfile = (e) => {
    dispatch(showActions.displayViewProfile(e));
  };
  const displayHome = (e) => {
    dispatch(showActions.displayHome(e));
  };
  const displaySearch = (e) => {
    dispatch(showActions.displaySearch(e));
  };

  useEffect(() => {
    updateFollowingList();
  }, [userList]);

  const toggleModal = (user) => {
    setModal(!modal);
    setModalPrompt(`Are you sure want to follow ${user.email}`);
    for (var j = 0; j < userList.length; j++) {
      if (user.email === following[j]) {
        setModalPrompt(`Are you sure want to unfollow ${user.email}`);
      }
    }
    setSelectedUser(user);
  };

  const isFollowingButton = (userEmail) => {
    isFollowingStatus = "FOllOW";
    for (var j = 0; j < userList.length; j++) {
      if (userEmail === following[j]) {
        isFollowingStatus = "UNFOllOW";
      }
    }
    return <p id="addButton">{isFollowingStatus}</p>;
  };

  const display = (value) => {
    userInput.value = "";
    if (value === "people") {
      followerElement.classList.remove("tab-active");
      followingElement.classList.remove("tab-active");
      peopleElement.classList.add("tab-active");
      setpeopleDisplay(true);
      setfollowingDisplay(false);
      setfollowerDisplay(false);
    } else if (value === "following") {
      followerElement.classList.remove("tab-active");
      peopleElement.classList.remove("tab-active");
      followingElement.classList.add("tab-active");
      setpeopleDisplay(false);
      setfollowingDisplay(true);
      setfollowerDisplay(false);
    } else {
      followingElement.classList.remove("tab-active");
      peopleElement.classList.remove("tab-active");
      followerElement.classList.add("tab-active");
      setpeopleDisplay(false);
      setfollowingDisplay(false);
      setfollowerDisplay(true);
    }
  };

  const updateFollowingList = () => {
    console.log(userList);
    if (following) {
      let usersArray = [];
      if (userList) {
        for (var j = 0; j < userList.length; j++) {
          if (following[j] === userList[j].email) {
            usersArray.push(userList[j]);
          }
        }
      }
      setFollowingUsers(usersArray);
    }

    if (followers) {
      let usersArray = [];
      if (userList) {
        for (var j = 0; j < userList.length; j++) {
          for (var x = 0; x < followers.length; x++) {
            if (followers[x] === userList[j].email) {
              usersArray.push(userList[j]);
            }
          }
        }
      }
      setFollowerUsers(usersArray);
    }
  };

  const removeFriend = (user) => {
    setIsLoading(true);
    fetch(
      `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/following.json`
    )
      .then((response) => response.json())
      .then((data) => {
        let formattedData = Object.entries(data).map((key) => {
          return key;
        });
        for (var j = 0; j < formattedData.length; j++) {
          if (formattedData[j][1] === user.email) {
            let userRef = database.ref(
              `profile/${userId}/following/${formattedData[j][0]}`
            );
            userRef.remove();
          }
        }
        setTimeout(() => {
          setIsLoading(false);
          window.location.reload();
        }, 1500);
      });
  };

  const viewProfile = (user) => {
    guest(user);
    displayHome(false);
    displaySearch(false);
    displayViewProfile(true);
  };

  const viewProfileFollowing = (user) => {
    let editedUser = user[0];
    viewProfile(editedUser);
  };

  const addFriend = (user) => {
    setIsLoading(true);
    fetch(
      `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/following.json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          fetch(
            `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/following.json`,
            {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user.email),
            }
          ).then((response) => {
            if (response.ok) {
              followerUserId = uneditedUserList.filter(
                (uneditedUser) => uneditedUser[1].email === user.email
              );
              fetch(
                `https://chat-application-db-default-rtdb.firebaseio.com/profile/${followerUserId[0][0]}/followers.json`,
                {
                  method: "post",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(email),
                }
              ).then((response) => {
                if (response.ok) {
                  console.log(
                    `You are now added to ${user.displayName} follower list`
                  );
                } else {
                  console.log(
                    `Unable to add you to ${user.displayName} follower list `
                  );
                }
                setTimeout(() => {
                  setIsLoading(false);
                  window.location.reload();
                }, 1500);
              });
            } else {
              console.log(`Unable to follow ${user.displayName}`);
            }
          });
        } else {
          let yourAlreadyFollowing = false;
          let users = Object.entries(data).map((key) => {
            return key;
          });
          for (var j = 0; j < users.length; j++) {
            if (user.email === users[j][1]) {
              yourAlreadyFollowing = true;
            }
          }

          if (yourAlreadyFollowing) {
            fetch(
              `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/following.json`
            )
              .then((response) => response.json())
              .then((data) => {
                let formattedData = Object.entries(data).map((key) => {
                  return key;
                });
                for (var j = 0; j < formattedData.length; j++) {
                  if (formattedData[j][1] === user.email) {
                    let userRef = database.ref(
                      `profile/${userId}/following/${formattedData[j][0]}`
                    );
                    userRef.remove();
                  }
                }
                setTimeout(() => {
                  setIsLoading(false);
                  window.location.reload();
                }, 1500);
              });
          } else {
            fetch(
              `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/following.json`,
              {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user.email),
              }
            ).then((response) => {
              if (response.ok) {
                followerUserId = uneditedUserList.filter(
                  (uneditedUser) => uneditedUser[1].email === user.email
                );
                fetch(
                  `https://chat-application-db-default-rtdb.firebaseio.com/profile/${followerUserId[0][0]}/followers.json`,
                  {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(email),
                  }
                ).then((response) => {
                  if (response.ok) {
                    console.log(
                      `You are now added to ${user.displayName} follower list`
                    );
                  } else {
                    console.log(
                      `Unable to add you to ${user.displayName} follower list `
                    );
                  }
                });
              } else {
                console.log(`Unable to follow ${user.displayName}`);
              }
              window.location.reload();
            });
          }
        }
      });
  };

  if (userInput) {
    userInput.addEventListener("input", (e) => {
      let searchString = e.target.value;
      let filter = searchString.toLowerCase();
      let userItem = userContainer.childNodes;
      for (let i = 0; i < userItem.length; i++) {
        if (filter.length) {
          if (
            userItem[i].childNodes[0].firstChild.innerHTML[
              filter.length - 1
            ].toLowerCase() !== filter.slice(-1)
          ) {
            userItem[i].style.display = "none";
          } else {
            userItem[i].style.display = "";
          }
        } else {
          userItem[i].style.display = "";
        }
      }
    });
  }

  return (
    <div className="friends-page">
      <div class="flex items-center justify-center mt-3 mb-3 ">
        <div class="flex border-2 rounded search-bar">
          <input
            type="text"
            class="px-4 py-2 w-80 text-black focus:text-white"
            placeholder="Search..."
            id="user-input"
          />
          <button class="flex items-center justify-center px-4 border-l bg-white">
            <svg
              class="w-6 h-6 text-gray-600"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="tabs tabs-boxed max-w-max m-auto flex-auto justify-evenly">
        <a
          id="people-tab"
          class="tab tab-active"
          onClick={() => display("people")}
        >
          PEOPLE
        </a>
        <a id="following-tab" class="tab" onClick={() => display("following")}>
          FOLLOWING
        </a>
        <a id="follower-tab" class="tab" onClick={() => display("followers")}>
          FOLLOWERS
        </a>
      </div>
      {userList ? (
        <div className="userList-container" id="user-container">
          {peopleDisplay && (
            <>
              {userList.map((user) => {
                return (
                  <div className="userList-item" id="user-item">
                    <div className="userList-item-name">
                      <p>
                        {user.displayName} {user.lastName}
                      </p>
                    </div>
                    <div className="button-container">
                      <div
                        onClick={() => toggleModal(user)}
                        className="btn btn-ghost "
                      >
                        {isFollowingButton(user.email)}
                      </div>
                      <div class={`modal ${modal ? " modal-open" : ""}`}>
                        <div class="modal-box m-auto">
                          <p>{modalPrompt}</p>
                          <div class="modal-action">
                            {!isLoading ? (
                              <>
                                <label
                                  for="my-modal-2"
                                  class="btn btn-primary"
                                  onClick={() => addFriend(selectedUser)}
                                >
                                  Accept
                                </label>
                                <label
                                  for="my-modal-2"
                                  class="btn"
                                  onClick={() => setModal(false)}
                                >
                                  Close
                                </label>
                              </>
                            ) : (
                              <>
                                {" "}
                                <BeatLoader
                                  color="#ffffff"
                                  css={override}
                                  size={50}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="btn btn-ghost"
                        onClick={() => viewProfile(user)}
                      >
                        VIEW PROFILE
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {followingDisplay && (
            <>
              {uneditedFollowingList ? (
                <>
                  {uneditedFollowingList.map((user) => {
                    return (
                      <div className="userList-item" id="user-item">
                        <div className="userList-item-name">
                          <p>
                            {user[0].displayName} {user[0].lastName}
                          </p>
                        </div>
                        <div className="button-container">
                          <div
                            onClick={() => toggleModal(user[0])}
                            className="btn btn-ghost "
                          >
                            {isFollowingButton(user[0].email)}
                          </div>
                          <div class={`modal ${modal ? " modal-open" : ""}`}>
                            <div class="modal-box m-auto">
                              <p>{modalPrompt}</p>
                              <div class="modal-action">
                                <label
                                  for="my-modal-2"
                                  class="btn btn-primary"
                                  onClick={() => removeFriend(selectedUser)}
                                >
                                  UNFOLLOW
                                </label>
                                <label
                                  for="my-modal-2"
                                  class="btn"
                                  onClick={() => setModal(false)}
                                >
                                  Close
                                </label>
                              </div>
                            </div>
                          </div>
                          <div
                            className="btn btn-ghost"
                            onClick={() => viewProfileFollowing(user)}
                          >
                            VIEW PROFILE
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {followerDisplay && (
            <>
              {followerUsers.map((user) => {
                return (
                  <div className="userList-item" id="user-item">
                    <div className="userList-item-name">
                      <p>
                        {user.displayName} {user.lastName}
                      </p>
                    </div>
                    <div className="button-container">
                      <div
                        onClick={() => toggleModal(user)}
                        className="btn btn-ghost "
                      >
                        {isFollowingButton(user.email)}
                      </div>
                      <div class={`modal ${modal ? " modal-open" : ""}`}>
                        <div class="modal-box m-auto">
                          <p>{modalPrompt}</p>
                          <div class="modal-action">
                            <label
                              for="my-modal-2"
                              class="btn btn-primary"
                              onClick={() => addFriend(selectedUser)}
                            >
                              Accept
                            </label>
                            <label
                              for="my-modal-2"
                              class="btn"
                              onClick={() => setModal(false)}
                            >
                              Close
                            </label>
                          </div>
                        </div>
                      </div>
                      <div
                        className="btn btn-ghost"
                        onClick={() => viewProfile(user)}
                      >
                        VIEW PROFILE
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Search;
