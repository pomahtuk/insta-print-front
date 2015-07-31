import dispatcher from '../dispatcher/appDispatcher';
import InstagramActions from  '../actions/InstagramActions';
import SettingsActions from  '../actions/SettingsActions';
import SettingsStore from  '../stores/SettingsStore';

class InstagramStore {
  constructor() {
    this.locations = [];
    this.users = [];
    this.userPhotos = {};
    this.locationImages = [];
    this.currentLocationId = '';

    this.bindListeners({
      handleUpdateLocations: InstagramActions.UPDATE_LOCATIONS,
      handleSetLocationHoverState: InstagramActions.SET_LOCATION_HOVER_STATE,
      handleUpdateSettings: SettingsActions.UPDATE_SETTINGS,
      handleUpdateLocationImages: InstagramActions.UPDATE_LOCATION_IMAGES,
      handleUpdateUsers: InstagramActions.UPDATE_USERS,
      handleUpdateUserPhotos: InstagramActions.UPDATE_USER_PHOTOS,
      handleClearUserPhotos: InstagramActions.CLEAR_USER_PHOTOS
    });

    this.exportPublicMethods({
      getData: this.getLocations,
      getLocationImages: this.getLocationImages,
      getUsers: this.getUsers,
      getUserPhotos: this.getUserPhotos
    });

  }

  getLocationImages() {
    let {locationImages} = this.getState();
    return locationImages;
  }

  getLocations() {
    let {locations} = this.getState();
    return locations;
  }

  getUserPhotos() {
    let {userPhotos} = this.getState();
    return userPhotos;
  }

  getUsers() {
    let {users} = this.getState();
    return users;
  }

  handleUpdateLocationImages(locationImages) {
    // generate random sizes
    // locationImages.map((locationImage) => {
    //   return locationImage;
    // });
    this.locationImages = locationImages;
  }

  handleUpdateUsers(users) {
    this.users = users;
  }

  handleUpdateUserPhotos(userPhotos) {
    this.userPhotos = userPhotos;
  }

  handleClearUserPhotos() {
    this.userPhotos = {};
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
