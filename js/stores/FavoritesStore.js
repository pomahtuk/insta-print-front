import dispatcher from '../dispatcher/appDispatcher.js';
import LocationActions from  '../actions/LocationActions';

class FavoritesStore {
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

export default dispatcher.createStore(FavoritesStore, 'FavoritesStore');
