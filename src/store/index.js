import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialUploadImageState = {
  image: null,
  profileUrl: null,
  photoId: null,
  photoIds: null,
  photoCount: null,
  profileUrlFinal: null,
  showPhoto: false,
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

const initialShowState = { showModal: false, passwordIcon: false };

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
  },
});

const store = configureStore({
  reducer: {
    show: showSlice.reducer,
    form: formInputSlice.reducer,
    load: loadingSlice.reducer,
    authenticate: authenticationSlice.reducer,
    uploadImage: uploadImageSlice.reducer,
  },
});

export const showActions = showSlice.actions;
export const formActions = formInputSlice.actions;
export const loadingActions = loadingSlice.actions;
export const authenticationActions = authenticationSlice.actions;
export const uploadImageActions = uploadImageSlice.actions;

export default store;
