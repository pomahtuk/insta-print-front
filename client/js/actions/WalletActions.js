import dispatcher from '../dispatcher/appDispatcher.js';
import {SOCKET_URL} from '../constants/App';

class WalletActions {

  openSocket() {
    this.socket = new WebSocket(SOCKET_URL);
    let _super = this;
    this.socket.onmessage = (event) => {
      var data = JSON.parse(event.data);
      switch (data.method) {
        case 'money.updated':
          _super.actions.updateWallet(data);
          break;
      }
    };
  }

  closeSocket() {
    this.socket.close();
  }

  updateWallet(money) {
    this.dispatch(money);
  }
}

export default dispatcher.createActions(WalletActions);
