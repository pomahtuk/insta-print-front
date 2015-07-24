import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramActions from  '../actions/InstagramActions.js';

class InstagramStore {
  constructor() {
    this.locations = [];

    this.bindListeners({
      handleUpdateLocations: InstagramActions.UPDATE_LOCATIONS
    });

    this.exportPublicMethods({
      getLocations: this.getLocations
    });

  }

  getLocations() {
    let {locations} = this.getState();
    return locations;
  }

  handleUpdateLocations(locations) {
    this.locations = locations;
  }
}

export default dispatcher.createStore(InstagramStore, 'InstagramStore');
