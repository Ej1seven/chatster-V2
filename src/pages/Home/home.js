import { React, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from "react-redux";
import { storage, database } from "../../firebase/index";
import { uploadImageActions, loadingActions } from "../../store/index";
import defaultLogo from "../../photos/user.png";
import { IKImage } from "imagekitio-react";
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
import "./home.css";

const apiKey = "zge5f39fgjv7";

const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();

const Home = () => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.load.showLoadingIcon);
  const following = useSelector((state) => state.form.following);
  const followers = useSelector((state) => state.form.followers);
  const email = useSelector((state) => state.form.email);
  const displayName = useSelector((state) => state.form.displayName);
  const image = useSelector((state) => state.uploadImage.uploadPhoto);
  const imageGalleryPhoto = useSelector(
    (state) => state.uploadImage.photoGalleryUpload
  );
  const profileUrl = useSelector((state) => state.uploadImage.profileUrl);
  const profileUrlFinal = useSelector(
    (state) => state.uploadImage.profileUrlFinal
  );
  const photoGalleryUrl = useSelector(
    (state) => state.uploadImage.photoGalleryUrl
  );
  const photoGalleryList = useSelector(
    (state) => state.uploadImage.photoGalleryList
  );
  const handlePhotoGalleryList = (e) => {
    dispatch(uploadImageActions.photoGalleryList(e));
  };
  const userId = useSelector((state) => state.form.id);
  const photoId = useSelector((state) => state.uploadImage.photoId);
  const photoIds = useSelector((state) => state.uploadImage.photoIds);
  const photoCount = useSelector((state) => state.uploadImage.photoCount);
  const urlEndpoint = "  https://ik.imagekit.io/f8sxidbb7he/";

  const [photoList, setPhotoList] = useState([]);
  const loadingHandler = () => {
    dispatch(loadingActions.showLoadingIcon());
  };

  const handleImageChange = (event) => {
    event.preventDefault();
    if (event.target.files[0]);
    {
      dispatch(uploadImageActions.uploadPhoto(event.target.files[0]));
    }
  };

  const handleImageGalleryChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]);
    {
      dispatch(uploadImageActions.photoGalleryUpload(e.target.files[0]));
    }
  };

  const addPhoto = (e) => {
    const fileInput = document.getElementById("imageGalleryInput");
    fileInput.click();
  };

  console.log(following.length);

  useEffect(() => {
    if (!profileUrl) {
      if (profileUrlFinal) {
        document.getElementById("profile-photo").src = profileUrlFinal;
      } else {
        document.getElementById("profile-photo").src = defaultLogo;
      }
    }
    if (!photoGalleryList) {
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
    }
  });

  useEffect(() => {
    if (image) {
      handleUpload(1);
    }
  }, [image]);

  useEffect(() => {
    if (imageGalleryPhoto) {
      handleUpload();
    }
  }, [imageGalleryPhoto]);

  useEffect(() => {
    if (photoGalleryUrl) {
      fetch(
        `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/photoGallery.json`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(photoGalleryUrl),
        }
      ).then((response) => {
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
              dispatch(uploadImageActions.photoGalleryUpload(""));
              dispatch(uploadImageActions.photoGalleryUrl(""));

              handlePhotoGalleryList(photos);
            }
          });
        loadingHandler();
      });
    }
  }, [photoGalleryUrl]);

  useEffect(() => {
    if (profileUrl) {
      if (photoCount > 0) {
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
            throw new Error(errorMessage);
          });
        }
      });
      client.partialUpdateUser({
        id: cookies.get("streamUserId"),
        set: {
          image: profileUrl,
        },
      });
    }
  }, [profileUrl]);

  const handleUpload = (option) => {
    if (option === 1) {
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
    } else {
      loadingHandler();
      const uploadTask = storage
        .ref(`images/${imageGalleryPhoto.name}`)
        .put(imageGalleryPhoto);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(imageGalleryPhoto.name)
            .getDownloadURL()
            .then((uploadedUrl) => {
              dispatch(uploadImageActions.photoGalleryUrl(uploadedUrl));
            });
        }
      );
    }
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  return (
    <div className="home-screen">
      <div className="profile-image-container mt-8">
        <div className="w-full flex justify-center image">
          <img
            className="h-40 w-40 rounded-full object-cover"
            src={profileUrl}
            alt=""
            id="profile-photo"
          />{" "}
        </div>
        <input
          type="file"
          id="imageInput"
          hidden="hidden"
          onChange={handleImageChange}
        ></input>
        <i
          className="fas fa-edit pl-44 absolute mt-24 text-xl edit-photo-button"
          onClick={handleEditPicture}
        ></i>

        <p className="text-3xl mt-6 font-semibold">{displayName}</p>
        <p className="text-lg mb-2 font-thin">{email}</p>
      </div>
      <div className="followers-following-chats flex flex-row justify-around items-center text-center divide-x ">
        <div className="flex-1">
          <p className="text-3xl">{followers.length}</p>
          <p className="followers-following-chats-heading">Followers</p>
        </div>
        <div className="flex-1">
          <p className="text-3xl">{following.length}</p>
          <p className="followers-following-chats-heading">Following</p>
        </div>
      </div>
      <div className="flex justify-center items-center m-4 camera-container">
        <div>
          {!isLoading ? (
            <>
              <i class="fas fa-camera fa-3x " onClick={addPhoto}></i>
              <input
                type="file"
                id="imageGalleryInput"
                hidden="hidden"
                onChange={handleImageGalleryChange}
              ></input>
            </>
          ) : (
            <>
              <BeatLoader color="#ffffff" css={override} size={50} />
            </>
          )}
        </div>
      </div>
      {photoGalleryList && (
        <div className="picture-grid">
          {photoGalleryList.map((photo) => {
            return (
              <div className="photo-container object-scale-down">
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

export default Home;
