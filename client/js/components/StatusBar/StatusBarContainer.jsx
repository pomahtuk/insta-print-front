import React from 'react';

import InstagramUserPhotosActions from '../../actions/InstagramUserPhotosActions';
import CartStore from '../../stores/CartStore';

let StatusBarContainer = React.createClass({
  getInitialState() {
    return {
      cart: {},
      wallet: {}
    };
  },

  componentDidMount() {
    CartStore.listen(this._onChange.bind(this, 'cart', CartStore));
  },

  componentWillUnmount() {
    CartStore.unlisten(this._onChange.bind(this, 'cart', CartStore));
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
    let {cart} = this.state;

    return (
      <div className="topbar">
        <div className="topbar__wallet">
          <i className="material-icons">account_balance_wallet</i>
          <span className="topbar__wallet-amount">1€</span>
        </div>
        <div className="topbar__basket">
          <i className="material-icons">shopping_cart</i>
          <span className="topbar__basket-count">{cart.totalCount || 0}</span>
        </div>
      </div>
    );
  }
});

export default StatusBarContainer;
