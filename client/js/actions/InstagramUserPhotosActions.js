import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramUserPhotosActions {

  getUserPhotos(userId, apiKey) {
    let request = InstagramSource.getUserMedia(userId, apiKey);
    request
      .then((response) => this.actions.updateUserPhotos(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  getMoreUserPhotos(link) {
    let request = InstagramSource.getMoreMedia(link);
    request
      .then((response) => this.actions.addUserPhotos(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  updateUserPhotos(userPhotosResponse) {
    let { data, pagination, meta } = userPhotosResponse;

    if (meta.code !== 200) {
      this.actions.instagramFailed(meta);
    } else {
      this.dispatch({
        data: data,
        pagination: pagination
      });
    }
  }

  addUserPhotos(userPhotosResponse) {
    let { data, pagination, meta } = userPhotosResponse;
    if (meta.code !== 200) {
      this.actions.instagramFailed(meta);
    } else {
      this.dispatch({
        data: data,
        pagination: pagination
      });
    }
  }

  preloadPhotos(photos) {
    photos.forEach((photo, index) => {
      if (photo.preloaded) return true;

      let img = new Image();
      let imageLink = `${photo.link}media/?size=l`;
      img.onload = () => {
        photo.imageLink = imageLink;
        photo.preloaded = true;
        this.actions.updateSingleUserPhoto(photo);
      };
      img.src = imageLink;
    });
  }

  updateSingleUserPhoto(photo) {
    this.dispatch(photo);
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

  instagramFailed(errorData) {
    this.dispatch(errorData);
  }

}

export default dispatcher.createActions(InstagramUserPhotosActions);
