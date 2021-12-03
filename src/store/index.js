import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialUploadImageState = {
  image: null,
  profileUrl: null,
  photoId: null,
  photoIds: null,
  photoCount: null,
  profileUrlFinal: null,
  showPhoto: false,
  photoGalleryUpload: null,
  photoGalleryUrl: null,
  photoGalleryList: null,
};

const uploadImageSlice = createSlice({
  name: "uploadImage",
  initialState: initialUploadImageState,
  reducers: {
    uploadPhoto(state, action) {
      state.uploadPhoto = action.payload;
    },
    profileUrl(state, action) {
      state.profileUrl = action.payload;
    },
    photoIds(state, action) {
      state.photoIds = action.payload;
    },
    photoId(state, action) {
      state.photoId = action.payload;
    },
    photoCount(state, action) {
      state.photoCount = action.payload;
    },
    profileUrlFinal(state, action) {
      state.profileUrlFinal = action.payload;
    },
    photoGalleryUpload(state, action) {
      state.photoGalleryUpload = action.payload;
    },
    photoGalleryUrl(state, action) {
      state.photoGalleryUrl = action.payload;
    },
    photoGalleryList(state, action) {
      state.photoGalleryList = action.payload;
    },
  },
});

const initialAuthenticationState = {
  token: "",
  logout: "",
};

const authenticationSlice = createSlice({
  name: "authenticate",
  initialState: initialAuthenticationState,
  reducers: {
    token(state, action) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = "";
    },
  },
});

const initialGetStreamState = {
  streamToken: null,
  streamUserId: "",
  username: "",
  fullName: "",
  avatarURL: "",
  phoneNumber: "",
  hashedPassword: "",
  password: "",
};

const getStreamSlice = createSlice({
  name: "stream",
  initialState: initialGetStreamState,
  reducers: {
    streamToken(state, action) {
      state.streamToken = action.payload;
    },
    streamUserId(state, action) {
      state.streamUserId = action.payload;
    },
    username(state, action) {
      state.username = action.payload;
    },
    fullName(state, action) {
      state.fullName = action.payload;
    },
    avatarURL(state, action) {
      state.avatarURL = action.payload;
    },
    phoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    hashedPassword(state, action) {
      state.hashedPassword = action.payload;
    },
    password(state, action) {
      state.password = action.payload;
    },
  },
});

const initialLoadingState = { showLoadingIcon: false };

const loadingSlice = createSlice({
  name: "loading",
  initialState: initialLoadingState,
  reducers: {
    showLoadingIcon(state) {
      state.showLoadingIcon = !state.showLoadingIcon;
    },
  },
});

const initialShowState = {
  showModal: false,
  passwordIcon: false,
  displayComponent: true,
  displayHome: true,
  displayHomeBase: false,
  displaySearch: false,
  displayViewProfile: false,
};

const showSlice = createSlice({
  name: "show",
  initialState: initialShowState,
  reducers: {
    showModal(state) {
      state.showModal = !state.showModal;
    },
    passwordIcon(state) {
      state.passwordIcon = !state.passwordIcon;
    },
    displayComponent(state, action) {
      state.displayComponent = action.payload;
    },
    displayHomeBase(state) {
      state.displayHomeBase = !state.displayHomeBase;
    },
    displayHome(state, action) {
      state.displayHome = action.payload;
    },
    displaySearch(state, action) {
      state.displaySearch = action.payload;
    },
    displayViewProfile(state, action) {
      state.displayViewProfile = action.payload;
    },
  },
});

const initialLoginState = {
  email: "",
  password: "",
  displayName: "",
  firstName: "",
  lastName: "",
  id: "",
  phoneNumber: "",
  uneditedUserList: "",
  usersList: null,
  following: "",
  uneditedFollowingList: "",
  followers: "",
  guestUser: "",
};

const formInputSlice = createSlice({
  name: "form",
  initialState: initialLoginState,
  reducers: {
    email(state, action) {
      state.email = action.payload;
    },
    password(state, action) {
      state.password = action.payload;
    },
    displayName(state, action) {
      state.displayName = action.payload;
    },
    firstName(state, action) {
      state.firstName = action.payload;
    },
    lastName(state, action) {
      state.lastName = action.payload;
    },
    id(state, action) {
      state.id = action.payload;
    },
    phoneNumber(state, action) {
      state.phoneNumber = action.payload;
    },
    uneditedUserList(state, action) {
      state.uneditedUserList = action.payload;
    },
    usersList(state, action) {
      state.usersList = action.payload;
    },
    following(state, action) {
      state.following = action.payload;
    },
    uneditedFollowingList(state, action) {
      state.uneditedFollowingList = action.payload;
    },
    followers(state, action) {
      state.followers = action.payload;
    },
    guestUser(state, action) {
      state.guestUser = action.payload;
    },
  },
});

const initialGetStreamChannelState = {
  createType: "",
  isCreating: false,
  isEditing: false,
  createChannel: true,
};

const getStreamChannelSlice = createSlice({
  name: "channel",
  initialState: initialGetStreamChannelState,
  reducers: {
    createType(state, action) {
      state.createType = action.payload;
    },
    isCreating(state, action) {
      state.isCreating = action.payload;
    },
    isEditing(state, action) {
      state.isEditing = !state.isEditing;
    },
    createChannel(state, action) {
      state.createChannel = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    show: showSlice.reducer,
    form: formInputSlice.reducer,
    load: loadingSlice.reducer,
    authenticate: authenticationSlice.reducer,
    uploadImage: uploadImageSlice.reducer,
    stream: getStreamSlice.reducer,
    channel: getStreamChannelSlice.reducer,
  },
});

export const showActions = showSlice.actions;
export const formActions = formInputSlice.actions;
export const loadingActions = loadingSlice.actions;
export const authenticationActions = authenticationSlice.actions;
export const uploadImageActions = uploadImageSlice.actions;
export const getStreamActions = getStreamSlice.actions;
export const getStreamChannelActions = getStreamChannelSlice.actions;

export default store;
