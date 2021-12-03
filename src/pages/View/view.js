import { React } from "react";
import { useSelector } from "react-redux";

import "./view.css";

const View = () => {
  const guest = useSelector((state) => state.form.guestUser);
  let viewProfilePhoto;
  let numberOfFollowers = [];
  let numberOfPeopleImFollowing = [];
  let formattedFollowerData;
  let formattedFollowingData;
  if (guest.followers) {
    formattedFollowerData = Object.entries(guest.followers).map((key) => {
      return key;
    });
    for (var j = 0; j < formattedFollowerData.length; j++) {
      numberOfFollowers.push(formattedFollowerData[j][1]);
    }
  }
  if (guest.following) {
    formattedFollowingData = Object.entries(guest.following).map((key) => {
      return key;
    });
    for (var j = 0; j < formattedFollowingData.length; j++) {
      numberOfPeopleImFollowing.push(formattedFollowingData[j][1]);
    }
  }

  if (guest.profilePhoto) {
    let photo = Object.keys(guest.profilePhoto);
    viewProfilePhoto = guest.profilePhoto[photo];
    console.log(viewProfilePhoto);
  } else {
    viewProfilePhoto = "";
  }

  return (
    <div>
      {" "}
      <div className="view-profile-image-container">
        <img
          className="h-40 w-40 rounded-full object-cover"
          src={viewProfilePhoto}
          alt=""
          id="profile-photo"
        />
        <p className="text-3xl mt-6 font-semibold">{guest.displayName}</p>
        <p className="text-lg mb-2 font-thin">{guest.email}</p>
      </div>
      <div className="view-followers-following-chats flex flex-row justify-around items-center text-center divide-x ">
        <div className="flex-1">
          <p className="text-3xl">{numberOfFollowers.length}</p>
          <p className="view-followers-following-chats-heading">Followers</p>
        </div>
        <div className="flex-1">
          <p className="text-3xl">{numberOfPeopleImFollowing.length}</p>
          <p className="view-followers-following-chats-heading">Following</p>
        </div>
      </div>
    </div>
  );
};

export default View;
