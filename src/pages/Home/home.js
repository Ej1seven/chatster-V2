import { React, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from "react-redux";
import { storage, database } from "../../firebase/index";
import { uploadImageActions } from "../../store/index";
import "./home.css";

const apiKey = "yzq768xf9r3a";

const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();

const Home = () => {
  console.log(client.activeChannels);
  const dispatch = useDispatch();
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
  const hidePhoto = false;
  const [photoList, setPhotoList] = useState([]);

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
      console.log(profileUrlFinal);
      document.getElementById("profile-photo").src = profileUrlFinal;
    }
    if (!photoGalleryList) {
      fetch(
        `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/photoGallery.json`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            let photos = [];
            console.log("photo gallery", data);
            let formattedData = Object.entries(data).map((key) => {
              return key;
            });
            console.log(formattedData);

            for (var j = 0; j < formattedData.length; j++) {
              photos.push(formattedData[j][1]);
            }
            console.log(photos);
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
      console.log(imageGalleryPhoto);
      handleUpload();
    }
    console.log(photoGalleryList);
  }, [imageGalleryPhoto]);

  useEffect(() => {
    if (photoGalleryUrl) {
      console.log(photoGalleryUrl);
      fetch(
        `https://chat-application-db-default-rtdb.firebaseio.com/profile/${userId}/photoGallery.json`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(photoGalleryUrl),
        }
      ).then((response) => {
        console.log(response);
      });
    }
  }, [photoGalleryUrl]);

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
      <div className="flex justify-center items-center m-4" onClick={addPhoto}>
        <div>
          <i class="fas fa-camera fa-3x "></i>
          <input
            type="file"
            id="imageGalleryInput"
            hidden="hidden"
            onChange={handleImageGalleryChange}
          ></input>
        </div>
      </div>
      {photoGalleryList && (
        <div className="picture-grid">
          {photoGalleryList.map((photo) => {
            return (
              <div className="photo-container object-cover">
                <img src={photo} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
