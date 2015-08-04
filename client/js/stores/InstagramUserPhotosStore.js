import dispatcher from '../dispatcher/appDispatcher';
import InstagramUserPhotosActions from  '../actions/InstagramUserPhotosActions';
import CartStore from  '../stores/CartStore';

class InstagramUserPhotosStore {
  constructor() {
    this.userPhotos = {};

    this.bindListeners({
      handleUpdateUserPhotos: InstagramUserPhotosActions.UPDATE_USER_PHOTOS,
      handleClearUserPhotos: InstagramUserPhotosActions.CLEAR_USER_PHOTOS,
      setCartItems: InstagramUserPhotosActions.ADD_TO_CART,
      resetAllCartItems: InstagramUserPhotosActions.CLEAR_CART
    });

    // no claer way to add as an object
    this.bindAction(InstagramUserPhotosActions.REMOVE_FROM_CART, this.setCartItems);

    this.exportPublicMethods({
      getData: this.getUserPhotos
    });

  }

  getUserPhotos() {
    let {userPhotos} = this.getState();
    return userPhotos;
  }

  handleUpdateUserPhotos(userPhotos) {
    this.userPhotos = userPhotos;
  }

  handleClearUserPhotos() {
    this.userPhotos = {};
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
