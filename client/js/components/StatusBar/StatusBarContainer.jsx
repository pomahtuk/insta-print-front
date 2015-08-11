import React from 'react';

import InstagramUserPhotosActions from '../../actions/InstagramUserPhotosActions';
import CartStore from '../../stores/CartStore';
import WalletStore from '../../stores/WalletStore';
import WalletActions from '../../actions/WalletActions';

let StatusBarContainer = React.createClass({
  getInitialState() {
    return {
      cart: {},
      wallet: {}
    };
  },

  componentDidMount() {
    CartStore.listen(this._onChange.bind(this, 'cart', CartStore));
    WalletStore.listen(this._onChange.bind(this, 'wallet', WalletStore));
  },

  componentWillUnmount() {
    CartStore.unlisten(this._onChange.bind(this, 'cart', CartStore));
    WalletStore.unlisten(this._onChange.bind(this, 'wallet', WalletStore));
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();
      this.setState(updateObj);
    }
  },

  render() {
    let {cart, wallet} = this.state;
    let totalCount = cart.totalCount || 0;
    let totalAmount = wallet.money || 0;
    // may be a more complex logic but for now it is good
    let totalPrice = totalCount > 0 ? ` (${totalCount}€)` : '';

    return (
      <div className="topbar">
        <div className="topbar__wallet">
          <i className="material-icons">account_balance_wallet</i>
        <span className="topbar__wallet-amount">{totalAmount}€</span>
        </div>
        <div className="topbar__basket">
          <i className="material-icons">shopping_cart</i>
          <span className="topbar__basket-count">{totalCount}{totalPrice}</span>
        </div>
      </div>
    );
  }
});

export default StatusBarContainer;
