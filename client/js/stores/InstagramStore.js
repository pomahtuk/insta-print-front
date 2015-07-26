import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramActions from  '../actions/InstagramActions.js';

class InstagramStore {
  constructor() {
    this.locations = [];

    this.bindListeners({
      handleUpdateLocations: InstagramActions.UPDATE_LOCATIONS,
      handleSetLocationHoverState: InstagramActions.SET_LOCATION_HOVER_STATE
    });

    this.exportPublicMethods({
      getData: this.getLocations
    });

  }

  getLocations() {
    let {locations} = this.getState();
    return locations;
  }

  handleUpdateLocations(locations) {
    this.locations = locations;
  }

  handleSetLocationHoverState(params) {
    this.locations.map((location) => {
      location.hovered = location.id === params.id ? params.state : false;
      return location;
    });
  }
}

export default dispatcher.createStore(InstagramStore, 'InstagramStore');
