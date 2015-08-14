import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramPhotosActions {

  getPhotos(type = 'user', key, apiKey) {
    let request = null;
    if (type === 'user') {
      request = InstagramSource.getUserMedia(key, apiKey);
    } else {
      request = InstagramSource.getTagMedia(key, apiKey);
    }
    request
      .then((response) => this.actions.updatePhotos(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  getMorePhotos(link) {
    let request = InstagramSource.getMoreMedia(link);
    request
      .then((response) => this.actions.addPhotos(response.data))
      .catch((response) =>  this.actions.instagramFailed(response));
  }

  updatePhotos(photosResponse) {
    let { data, pagination, meta } = photosResponse;

    if (meta.code !== 200) {
      this.actions.instagramFailed(meta);
    } else {
      this.dispatch({
        data: data,
        pagination: pagination
      });
    }
  }

  addPhotos(photosResponse) {
    let { data, pagination, meta } = photosResponse;
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
        this.actions.updateSinglePhoto(photo);
      };
      img.src = imageLink;
    });
  }

  updateSinglePhoto(photo) {
    this.dispatch(photo);
  }

  clearPhotos() {
    this.dispatch();
  }

  addToCart(photo) {
    this.dispatch(photo);
  }

  removeFromCart(photo) {
    this.dispatch(photo);
  }

  clearCart() {
    this.dispatch();
  }

  instagramFailed(errorData) {
    this.dispatch(errorData.statusText);
  }

}

export default dispatcher.createActions(InstagramPhotosActions);
