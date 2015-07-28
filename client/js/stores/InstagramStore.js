import dispatcher from '../dispatcher/appDispatcher';
import InstagramActions from  '../actions/InstagramActions';
import SettingsActions from  '../actions/SettingsActions';
import SettingsStore from  '../stores/SettingsStore';

class InstagramStore {
  constructor() {
    this.locations = [];
    this.currentLocationId = '';

    this.bindListeners({
      handleUpdateLocations: InstagramActions.UPDATE_LOCATIONS,
      handleSetLocationHoverState: InstagramActions.SET_LOCATION_HOVER_STATE,
      handleUpdateSettings: SettingsActions.UPDATE_SETTINGS
    });

    this.exportPublicMethods({
      getData: this.getLocations
    });

  }

  getLocations() {
    let {locations} = this.getState();
    return locations;
  }

  handleUpdateSettings() {
    this.waitFor(SettingsStore.dispatchToken);
    this.currentLocationId = SettingsStore.getOption('location-id');

    this.locations.map((location) => {
      location.current = location.id === this.currentLocationId ? true : false;
      return location;
    });
  }

  handleUpdateLocations(locations) {
    // set current location and hovered to false
    locations.map((location) => {
      location.current = location.id === this.currentLocationId ? true : false;
      location.hovered = false;
      return location;
    });
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
