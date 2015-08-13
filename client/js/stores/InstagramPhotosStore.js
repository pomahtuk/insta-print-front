import dispatcher from '../dispatcher/appDispatcher';
import InstagramPhotosActions from  '../actions/InstagramPhotosActions';
import CartStore from  '../stores/CartStore';

class InstagramPhotosStore {
  constructor() {
    this.photos = {};
    this.error = {};
    this.fullUpdate = false;
    this.hasMorePhotos = true;

    this.bindListeners({
      handleUpdatePhotos: InstagramPhotosActions.UPDATE_PHOTOS,
      handleAddPhotos: InstagramPhotosActions.ADD_PHOTOS,
      handleUpdateSinglePhoto: InstagramPhotosActions.UPDATE_SINGLE_PHOTO,
      handleClearPhotos: InstagramPhotosActions.CLEAR_PHOTOS,
      setCartItems: InstagramPhotosActions.ADD_TO_CART,
      resetAllCartItems: InstagramPhotosActions.CLEAR_CART,
      handleError: InstagramPhotosActions.INSTAGRAM_FAILED
    });

    // no claer way to add as an object
    this.bindAction(InstagramPhotosActions.REMOVE_FROM_CART, this.setCartItems);

    this.exportPublicMethods({
      getData: this.getPhotos
    });

  }

  getPhotos() {
    let data = this.getState();
    return data;
  }

  handleAddPhotos(photos) {
    //and now we talk!
    photos.data.forEach((photo) => photo.preloaded = false);
    // should be shorter way
    this.photos.data = this.photos.data.concat(photos.data);
    this.photos.pagination = photos.pagination;
    this.photos = !!photos.pagination.next_url;
    this.error = null;
    this.fullUpdate = true;
  }

  handleUpdatePhotos(photos) {
    if (photos) {
      photos.data.forEach((photo) => photo.preloaded = false);
      this.photos = photos;
      this.error = null;
      this.hasMorePhotos = !!photos.pagination.next_url;
      this.fullUpdate = true;
    }
  }

  handleUpdateSinglePhoto(newPhoto) {
    let photos = this.photos.data || [];
    photos.some((photo) => {
      if (newPhoto.id === photo.id) {
        photo = newPhoto;
        return true;
      }
    });
    this.fullUpdate = false;
  }

  handleClearPhotos() {
    this.photos = {

    };
  }

  handleError(errorData) {
    this.error = errorData;
    // errors must be handles smarter
    // this.handleClearUserPhotos();
  }

  resetAllCartItems() {
    this.photos.data = this.photos.data.map((photo) => {
      photo.addedToCart = false;
      delete photo.countAdded;
      return photo;
    });
  }

  setCartItems() {
    this.waitFor(CartStore);

    // in case we are doing something on order page
    let {data} = this.photos;
    if (!data) return;

    let cartItems = CartStore.getState().items;

    cartItems.forEach((photo) => {
      // find each location in the array
      for (var i = 0; i < data.length; i += 1) {

        // set addedToCart to true
        if (data[i].id === photo.id) {
          data[i].countAdded = photo.countAdded;
          data[i].addedToCart = photo.addedToCart;
          break;
        }
      }
    });
  }

}

export default dispatcher.createStore(InstagramPhotosStore, 'InstagramPhotosStore');
