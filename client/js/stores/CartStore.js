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
    item.countAdded = item.countAdded ? item.countAdded + 1 : 1;
    item.addedToCart = true;
    this.items.push(item);
  }

  handleRemoveFromCard(item) {
    if (item.countAdded === 1) {
      // no more items lift in cart
      let i = 0;
      let max = this.items.length;
      let newItems = [];

      item.addedToCart = false;
      delete item.countAdded;

      for (i = 0; i < max; i++) {
        let currentItem = this.items[i];
        if (currentItem.id !== item.id) {
          newItems.push(currentItem);
        }
      }
      this.items = newItems;
    } else {
      item.countAdded = item.countAdded - 1;
    }
  }

  handleClearCart() {
    this.items = [];
  }

  getCartItems() {
    return this.getState();
  }

}

export default dispatcher.createStore(CartStore, 'CartStore');
