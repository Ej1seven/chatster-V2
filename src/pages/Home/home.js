import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { storage, database } from "../../firebase/index";
import { uploadImageActions } from "../../store/index";
import "./home.css";

const Home = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.form.email);
  const displayName = useSelector((state) => state.form.displayName);
  const image = useSelector((state) => state.uploadImage.uploadPhoto);
  const profileUrl = useSelector((state) => state.uploadImage.profileUrl);
  const profileUrlFinal = useSelector(
    (state) => state.uploadImage.profileUrlFinal
  );
  const userId = useSelector((state) => state.form.id);
  const photoId = useSelector((state) => state.uploadImage.photoId);
  const photoIds = useSelector((state) => state.uploadImage.photoIds);
  const photoCount = useSelector((state) => state.uploadImage.photoCount);
  const hidePhoto = false;

  const handleImageChange = (event) => {
    event.preventDefault();
    if (event.target.files[0]);
    {
      dispatch(uploadImageActions.uploadPhoto(event.target.files[0]));
    }
  };

  useEffect(() => {
    if (!profileUrl) {
      console.log(profileUrlFinal);
      document.getElementById("profile-photo").src = profileUrlFinal;
    }
  });

  useEffect(() => {
    if (image) {
      handleUpload();
    }
  }, [image]);

  useEffect(() => {
    if (profileUrl) {
      if (photoCount > 0) {
        console.log(photoIds);
        for (let i = 0; i < photoIds.length; i++) {
          if (photoIds[i] !== photoId) {
            let userRef = database.ref(
              `profile/${userId}/profilePhoto/${photoIds[i]}`
            );
            userRef.remove();
          }
        }
      }
      fetch(
        `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/profilePhoto.json`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileUrl),
        }
      ).then((response) => {
        console.log(response);
        if (response.ok) {
          fetch(
            `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/profilePhoto.json`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                let photoList = Object.entries(data).map((key) => {
                  return key;
                });
                if (photoList.length > 1) {
                  let profileId = photoList[0][0];
                  dispatch(uploadImageActions.profileUrl(photoList[1][1]));
                  let userRef = database.ref(
                    `profile/${userId}/profilePhoto/${profileId}`
                  );
                  userRef.remove();
                }
              }
            });
        } else {
          return response.json().then((data) => {
            let errorMessage = "Authentication failed!";
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }
            throw new Error(errorMessage);
          });
        }
      });
    }
  }, [profileUrl]);

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((uploadedUrl) => {
            dispatch(uploadImageActions.profileUrl(uploadedUrl));
          });
      }
    );
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  return (
    <div className="home-screen">
      <div className="profile-image-container">
        <img
          className="h-40 w-40 rounded-full object-cover"
          src={profileUrl}
          alt=""
          id="profile-photo"
        />
        <input
          type="file"
          id="imageInput"
          hidden="hidden"
          onChange={handleImageChange}
        ></input>
        <i
          className="fas fa-edit pl-40 absolute mt-10 text-xl edit-photo-button"
          onClick={handleEditPicture}
        ></i>
        <p className="text-3xl mt-6 font-semibold">{displayName}</p>
        <p className="text-lg mb-2 font-thin">{email}</p>
      </div>
      <div className="followers-following-chats flex flex-row justify-around items-center text-center divide-x ">
        <div className="flex-1">
          <p className="text-3xl">100</p>
          <p className="followers-following-chats-heading">Followers</p>
        </div>
        <div className="flex-1">
          <p className="text-3xl">85</p>
          <p className="followers-following-chats-heading">Followering</p>
        </div>
        <div className="flex-1">
          <p className="text-3xl">100</p>
          <p className="followers-following-chats-heading">Chats</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
