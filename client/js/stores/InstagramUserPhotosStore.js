import dispatcher from '../dispatcher/appDispatcher';
import InstagramUserPhotosActions from  '../actions/InstagramUserPhotosActions';
import CartStore from  '../stores/CartStore';

class InstagramUserPhotosStore {
  constructor() {
    this.userPhotos = {};
    this.error = {};
    this.fullUpdate = false;
    this.hasMorePhotos = true;

    this.bindListeners({
      handleUpdateUserPhotos: InstagramUserPhotosActions.UPDATE_USER_PHOTOS,
      handleAddUserPhotos: InstagramUserPhotosActions.ADD_USER_PHOTOS,
      handleUpdateSingleUserPhoto: InstagramUserPhotosActions.UPDATE_SINGLE_USER_PHOTO,
      handleClearUserPhotos: InstagramUserPhotosActions.CLEAR_USER_PHOTOS,
      setCartItems: InstagramUserPhotosActions.ADD_TO_CART,
      resetAllCartItems: InstagramUserPhotosActions.CLEAR_CART,
      handleError: InstagramUserPhotosActions.INSTAGRAM_FAILED
    });

    // no claer way to add as an object
    this.bindAction(InstagramUserPhotosActions.REMOVE_FROM_CART, this.setCartItems);

    this.exportPublicMethods({
      getData: this.getUserPhotos
    });

  }

  getUserPhotos() {
    let data = this.getState();
    return data;
  }

  handleAddUserPhotos(userPhotos) {
    //and now we talk!
    userPhotos.data.forEach((photo) => photo.preloaded = false);
    // should be shorter way
    this.userPhotos.data = this.userPhotos.data.concat(userPhotos.data);
    this.userPhotos.pagination = userPhotos.pagination;
    this.hasMorePhotos = !!userPhotos.pagination.next_url;
    this.error = null;
    this.fullUpdate = true;
  }

  handleUpdateUserPhotos(userPhotos) {
    if (userPhotos) {
      userPhotos.data.forEach((photo) => photo.preloaded = false);
      this.userPhotos = userPhotos;
      this.error = null;
      this.hasMorePhotos = !!userPhotos.pagination.next_url;
      this.fullUpdate = true;
    }
  }

  handleUpdateSingleUserPhoto(userPhoto) {
    let photos = this.userPhotos.data || [];
    photos.some((photo) => {
      if (userPhoto.id === photo.id) {
        photo = userPhoto;
        return true;
      }
    });
    this.fullUpdate = false;
  }

  handleClearUserPhotos() {
    this.userPhotos = {

    };
  }

  handleError(errorData) {
    this.error = errorData;
    // errors must be handles smarter
    // this.handleClearUserPhotos();
  }

  resetAllCartItems() {
    this.userPhotos.data = this.userPhotos.data.map((userPhoto) => {
      userPhoto.addedToCart = false;
      delete userPhoto.countAdded;
      return userPhoto;
    });
  }

  setCartItems() {
    this.waitFor(CartStore);

    let cartItems = CartStore.getState().items;

    cartItems.forEach((photo) => {
      // find each location in the array
      for (var i = 0; i < this.userPhotos.data.length; i += 1) {

        // set addedToCart to true
        if (this.userPhotos.data[i].id === photo.id) {
          this.userPhotos.data[i].countAdded = photo.countAdded;
          this.userPhotos.data[i].addedToCart = photo.addedToCart;
          break;
        }
      }
    });
  }

}

export default dispatcher.createStore(InstagramUserPhotosStore, 'InstagramUserPhotosStore');
