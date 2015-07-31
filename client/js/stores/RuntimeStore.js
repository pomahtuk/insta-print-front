import dispatcher from '../dispatcher/appDispatcher.js';
import RuntimeActions from  '../actions/RuntimeActions.js';

class RuntimeStore {
  constructor() {
    this.storage = {};

    this.bindListeners({
      handleUpdateValue: RuntimeActions.UPDATE_VALUE
    });

    this.exportPublicMethods({
      getData: this.getStoreData,
      getValue: this.getValue
    });
  }

  handleUpdateValue(key, value) {
    this.storage[key] = value;
  }

  getStoreData() {
    return this.getState();
  }

  getValue(key) {
    let {storage} = this.getState();
    return storage[key];
  }

}

export default dispatcher.createStore(RuntimeStore, 'RuntimeStore');
