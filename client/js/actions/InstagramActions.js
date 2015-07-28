import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramActions {
  // this way! go to server here and dispatch all staff here!
  searchLocations(lat, lng, apiKey) {
    let request = InstagramSource.searchLocations(lat, lng, apiKey);
    request
      .then((response) => this.actions.updateLocations(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  // this way! go to server here and dispatch all staff here!
  getLocationImages(locationId, apiKey) {
    let request = InstagramSource.getMediaForLocation(locationId, apiKey);
    request
      .then((response) => this.actions.updateLocationImages(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  updateLocations(locationsResponse) {
    let { data } = locationsResponse;
    this.dispatch(data);
  }

  setLocationHoverState(locationId, state) {
    this.dispatch({
      id: locationId,
      state: state
    });
  }

  updateLocationImages(locationImages) {
    this.dispatch(locationImages);
  }

  instagramFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default dispatcher.createActions(InstagramActions);
