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

  updateLocations(locations) {
    this.dispatch(locations);
  }

  instagramFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default dispatcher.createActions(InstagramActions);
