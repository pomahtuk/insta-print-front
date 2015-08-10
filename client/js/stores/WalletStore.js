import dispatcher from '../dispatcher/appDispatcher.js';
import WalletActions from  '../actions/WalletActions.js';

class WalletStore {
  constructor() {
    this.money = {};

    this.bindListeners({
      handleUpdateWallet: WalletActions.UPDATE_WALLET
    });

    this.exportPublicMethods({
      getData: this.getStoreData
    });
  }

  getStoreData() {
    return this.getState();
  }

  handleUpdateWallet(money) {
    this.money = money;
  }
}

export default dispatcher.createStore(WalletStore, 'WalletStore');
