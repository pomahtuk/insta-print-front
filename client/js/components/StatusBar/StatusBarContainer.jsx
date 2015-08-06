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
        <span key="payment">
          <i className="material-icons">account_balance_wallet</i>
        </span>
        <span>
          <i className="material-icons dp48">shopping_cart</i>
          {cart.totalCount}
        </span>
      </div>
    );
  }
});

export default StatusBarContainer;
