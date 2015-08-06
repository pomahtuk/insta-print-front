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
    let existingItem = this.items.filter((ourItem) => item.id === ourItem.id);
    existingItem = existingItem[0];
    if (existingItem) {
      existingItem.countAdded = existingItem.countAdded ? existingItem.countAdded + 1 : 1;
    } else {
      item.countAdded = item.countAdded ? item.countAdded + 1 : 1;
      item.addedToCart = true;
      this.items.push(item);
    }

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
    let {items} = this.getState();

    let totalCount = items.reduce((total, currentItem) => total + currentItem.countAdded, 0);

    return {
      items: items,
      totalCount: totalCount
    };
  }

}

export default dispatcher.createStore(CartStore, 'CartStore');
