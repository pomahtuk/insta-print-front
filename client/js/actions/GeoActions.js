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
    let {latitude, longitude} = coordinates;
    let result = {
      latitude: latitude,
      longitude: longitude
    }
    this.dispatch(coordinates);
  }

  geoLocationFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default dispatcher.createActions(GeoActions);
