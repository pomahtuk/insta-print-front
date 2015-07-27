import dispatcher from '../dispatcher/appDispatcher.js';
import GeoActions from  '../actions/GeoActions.js';

class GeoStore {
  constructor() {
    this.coordinates = {};
    this.zoom = 18;
    this.positionError = null;

    this.bindListeners({
      handleUpdateCoordinates: GeoActions.UPDATE_COORDINATES,
      handleGeoLocationFailed: GeoActions.GEO_LOCATION_FAILED,
      handleUpdateZoomLevel: GeoActions.UPDATE_ZOOM_LEVEL
    });

    this.exportPublicMethods({
      getData: this.getStoreData
    });
  }

  getStoreData() {
    let {coordinates, zoom} = this.getState();
    return {
      coordinates: coordinates,
      zoom: zoom
    };
  }

  handleUpdateZoomLevel(zoom) {
    this.zoom = zoom;
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
