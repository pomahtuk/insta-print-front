import dispatcher from '../dispatcher/appDispatcher.js';
import GeoActions from  '../actions/GeoActions.js';

class GeoStore {
  constructor() {
    this.coordinates = {};
    this.positionError = null;

    this.bindListeners({
      handleUpdateCoordinates: GeoActions.UPDATE_COORDINATES,
      handleGeoLocationFailed: GeoActions.GEO_LOCATION_FAILED
    });

    this.exportPublicMethods({
      getCoordinates: this.getCoordinates
    });
  }

  getCoordinates() {
    let {coordinates} = this.getState();
    return coordinates;
  }

  handleUpdateCoordinates(coordinates) {
    this.coordinates = coordinates;
    this.positionError = null;
  }

  handleGeoLocationFailed(message) {
    this.positionError = message;
  }
}

export default dispatcher.createStore(GeoStore, 'GeoStore');
