import { React } from "react";
import { useSelector } from "react-redux";
import { IKImage } from "imagekitio-react";
import "./view.css";

const View = () => {
  const urlEndpoint = "  https://ik.imagekit.io/f8sxidbb7he/";

  const guest = useSelector((state) => state.form.guestUser);
  let viewProfilePhoto;
  let numberOfFollowers = [];
  let numberOfPeopleImFollowing = [];
  let formattedFollowerData;
  let formattedFollowingData;
  let photoGalleryList;
  console.log(guest);
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

  if (guest.photoGallery) {
    let photos = [];
    let formattedData = Object.entries(guest.photoGallery).map((key) => {
      return key;
    });
    console.log(formattedData);
    for (var j = 0; j < formattedData.length; j++) {
      photos.push(formattedData[j][1]);
    }
    console.log(photos);
    photoGalleryList = photos;
  }
  return (
    <div>
      {" "}
      <div className="view-profile-image-container mt-8">
        <img
          className="h-40 w-40 rounded-full object-cover"
          src={viewProfilePhoto}
          alt=""
          id="profile-photo"
        />
        <p className="text-3xl mt-6 font-semibold text-white">
          {guest.displayName}
        </p>
        <p className="text-lg mb-2 font-thin text-white">{guest.email}</p>
      </div>
      <div className="view-followers-following-chats flex flex-row justify-around items-center text-center divide-x ">
        <div className="flex-1">
          <p className="text-3xl text-white">{numberOfFollowers.length}</p>
          <p className="view-followers-following-chats-heading">Followers</p>
        </div>
        <div className="flex-1">
          <p className="text-3xl text-white">
            {numberOfPeopleImFollowing.length}
          </p>
          <p className="view-followers-following-chats-heading">Following</p>
        </div>
      </div>
      {photoGalleryList && (
        <div className="picture-grid view-profile-grid">
          {photoGalleryList.map((photo) => {
            return (
              <div className="photo-container object-scale-down">
                {/* <img className="gallery-image" src={photo} /> */}
                <IKImage
                  className="gallery-image"
                  urlEndpoint={urlEndpoint}
                  src={photo}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default View;
