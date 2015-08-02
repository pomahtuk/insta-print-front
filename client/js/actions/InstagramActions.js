import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramActions {
  // this way! go to server here and dispatch all staff here!
  searchLocations(lat, lng, apiKey) {
    let request = InstagramSource.searchLocations(lat, lng, apiKey);
    request
      .then((response) => this.actions.updateLocations(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  // this way! go to server here and dispatch all staff here!
  searchUsers(query, apiKey) {
    let request = InstagramSource.searchUsers(query, apiKey);
    request
      .then((response) => this.actions.updateUsers(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  // this way! go to server here and dispatch all staff here!
  getLocationImages(locationId, apiKey) {
    let request = InstagramSource.getMediaForLocation(locationId, apiKey);
    request
      .then((response) => this.actions.updateLocationImages(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  getImagesForCoordinates(lat, lng, apiKey) {
    let request = InstagramSource.getMediaForLatLng(lat, lng, apiKey);
    request
      .then((response) => this.actions.updateLocationImages(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  getUserPhotos(userId, apiKey) {
    let request = InstagramSource.getUserMedia(userId, apiKey);
    request
      .then((response) => this.actions.updateUserPhotos(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  updateUserPhotos(userPhotosResponse) {
    let { data, pagination } = userPhotosResponse;

    //

    this.dispatch({
      data: data,
      pagination: pagination
    });
  }

  clearUserPhotos() {
    this.dispatch();
  }

  updateUsers(usersResponse) {
    let { data } = usersResponse;
    this.dispatch(data);
  }

  updateLocations(locationsResponse) {
    let { data } = locationsResponse;
    this.dispatch(data);
  }

  setLocationHoverState(locationId, state) {
    this.dispatch({
      id: locationId,
      state: state
    });
  }

  updateLocationImages(locationImages) {
    let { data } = locationImages;
    this.dispatch(data);
  }

  instagramFailed(errorMessage) {
    this.dispatch(errorMessage);
  }

  addToCart(userPhoto) {
    this.dispatch(userPhoto);
  }

  removeFromCart(userPhoto) {
    this.dispatch(userPhoto);
  }

  clearCart() {
    this.dispatch();
  }
}

export default dispatcher.createActions(InstagramActions);
