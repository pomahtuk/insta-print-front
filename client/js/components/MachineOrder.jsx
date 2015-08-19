import React from 'react';

import CartStore from '../stores/CartStore';
import WalletStore from '../stores/WalletStore';
import WalletActions from '../actions/WalletActions';
import PrinterActions from '../actions/PrinterActions';
import PrinterStore from '../stores/PrinterStore';

import ImageBlock from '../components/Machine/ImageBlock.jsx';

import { Link } from 'react-router';
import classnames from 'classnames';

let MachineUsers = React.createClass({
  getInitialState() {
    return {
      isPrintingInProcess: false,
      wallet: {},
      cart: {
        items: []
      }
    };
  },

  componentDidMount() {
    CartStore.listen(this._onChange.bind(this, 'cart', CartStore));
    WalletStore.listen(this._onChange.bind(this, 'wallet', WalletStore));
    PrinterStore.listen(this._onChange.bind(this, 'printer', PrinterStore));
    this.setState({
      cart: CartStore.getData()
    });
  },

  componentWillUnmount() {
    CartStore.unlisten(this._onChange.bind(this, 'cart', CartStore));
    WalletStore.unlisten(this._onChange.bind(this, 'wallet', WalletStore));
    PrinterStore.unlisten(this._onChange.bind(this, 'printer', PrinterStore));
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();
      this.setState(updateObj);
    }
  },

  _toDisplayImage(cartItem, index) {
    return (
      <ImageBlock
        className="1111"
        key={cartItem.id}
        index={index}
        image={cartItem}
        colCount={3}
        paddingValue={5}
        orderMode={true}
      />
    );
  },

  _printSelectedImages() {
    let {items} = this.state.cart;
    PrinterActions.printImages(items);
  },

  render() {
    let {cart, wallet, printer} = this.state;

    console.log(cart, wallet, printer);

    return (
      <div className="app user-search-screen">
        {/* 1) title - "Confirm your order"*/}
        <h1 className="">
          Confirm your order (you are almost done!)
        </h1>
        {/* 2) all photos in cart with option to remove from cart*/}
        <div className="user-photos-screen__images-container">
          {cart.items.map(this._toDisplayImage, this)}
        </div>
        {/* 3) line with current balance and required balance*/}
        {wallet.money} / {cart.totalCount}
        {/* 4) print button, disabled if balance is less than required*/}
        <button onClick={this._printSelectedImages}>Print</button>
        {/* 5) (optional - some loader while printing order)*/}
      </div>
    );
  }
});

export default MachineUsers;
