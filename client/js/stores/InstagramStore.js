import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramActions from  '../actions/InstagramActions.js';

class InstagramStore {
  constructor() {
    this.locations = [];

    this.bindListeners({
      addFavoriteLocation: LocationActions.FAVORITE_LOCATION
    });
  }

  addFavoriteLocation(location) {
    this.locations.push(location);
  }
}

export default dispatcher.createStore(InstagramStore, 'InstagramStore');
