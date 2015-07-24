import dispatcher from '../dispatcher/appDispatcher.js';

class GeoActions {
  getCoordinates() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.actions.updateCoordinates(position.coords);
    }, () => {
       this.actions.geoLocationFailed('Unable to retrieve your location');
    });
  }

  updateCoordinates(coordinates) {
    var result = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }
    this.dispatch(result);
  }

  geoLocationFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default dispatcher.createActions(GeoActions);
