import dispatcher from '../dispatcher/appDispatcher';
import InstagramUserPhotosActions from  '../actions/InstagramUserPhotosActions';

class CartStore {
  constructor() {
    this.items = [];

    this.bindListeners({
      handleAddToCart: InstagramUserPhotosActions.ADD_TO_CART,
      handleRemoveFromCard: InstagramUserPhotosActions.REMOVE_FROM_CART,
      handleClearCart: InstagramUserPhotosActions.CLEAR_CART
    });

    this.exportPublicMethods({
      getData: this.getCartItems
    });
  }

  handleAddToCart(item) {
    this.items.push(item);
  }

  handleRemoveFromCard(item) {
    let i = 0;
    let max = this.items.length;
    let newItems = [];
    for (i = 0; i < max; i++) {
      let currentItem = this.items[i];
      if (currentItem.id !== item.id) {
        newItems.push(currentItem);
      }
    }
    this.items = newItems;
  }

  handleClearCart() {
    this.items = [];
  }

  getCartItems() {
    return this.getState();
  }

}

export default dispatcher.createStore(CartStore, 'CartStore');
