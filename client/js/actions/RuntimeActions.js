import dispatcher from '../dispatcher/appDispatcher.js';

class RuntimeActions {
  updateValue(key, value) {
    this.dispatch(key, value);
  }
}

export default dispatcher.createActions(RuntimeActions);
