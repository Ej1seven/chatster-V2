import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./search.css";

const Search = () => {
  const userList = useSelector((state) => state.form.usersList);

  // let usersArray;
  // const email = useSelector((state) => state.form.email);
  // const [loading, setLoading] = useState(false);

  // fetch("https://chat-application-db-default-rtdb.firebaseio.com/profile.json")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     let users = Object.entries(data).map((key) => {
  //       return key;
  //     });
  //     for (var j = 0; j < users.length; j++) {
  //       let formattedUserList = users.filter((user) => user[j].email !== email);
  //       usersArray = formattedUserList.map((user) => {
  //         return user[j];
  //       });
  //       console.log(usersArray);
  //     }
  //   });
  console.log(userList);

  return (
    <div>
      {userList ? (
        <div className="userList-container">
          {userList.map((user) => {
            return (
              <div className="userList-item">
                <div className="userList-item-name">
                  <p>
                    {user.displayName} {user.lastName}
                  </p>
                </div>
                <div className="btn btn-ghost">button</div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Search;
