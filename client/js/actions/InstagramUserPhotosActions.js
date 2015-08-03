import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramUserPhotosActions {

  getUserPhotos(userId, apiKey) {
    let request = InstagramSource.getUserMedia(userId, apiKey);
    request
      .then((response) => this.actions.updateUserPhotos(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  updateUserPhotos(userPhotosResponse) {
    let { data, pagination } = userPhotosResponse;

    this.dispatch({
      data: data,
      pagination: pagination
    });
  }

  clearUserPhotos() {
    this.dispatch();
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

  instagramFailed(errorMessage) {
    this.dispatch(errorMessage);
  }

}

export default dispatcher.createActions(InstagramUserPhotosActions);
