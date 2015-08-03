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
      handleRemoveFromCard: InstagramUserPhotosActions.REMOVE_FROM_CART,
      resetAllCartItems: InstagramUserPhotosActions.CLEAR_CART
    });

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
      return userPhoto;
    });
  }

  handleRemoveFromCard(userPhoto) {
    this.waitFor(CartStore);
    this.resetAllCartItems();
    this.setCartItems();
  }

  setCartItems() {
    this.waitFor(CartStore);

    let cartItems = CartStore.getState().items;

    this.resetAllCartItems();

    cartItems.forEach((photo) => {
      // find each location in the array
      for (var i = 0; i < this.userPhotos.data.length; i += 1) {

        // set addedToCart to true
        if (this.userPhotos.data[i].id === photo.id) {
          this.userPhotos.data[i].addedToCart = true;
          break;
        }
      }
    });
  }

}

export default dispatcher.createStore(InstagramUserPhotosStore, 'InstagramUserPhotosStore');
