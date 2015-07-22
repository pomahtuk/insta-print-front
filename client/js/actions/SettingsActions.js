import dispatcher from '../dispatcher/appDispatcher.js';
import SettingsSource from '../sources/SettingsSource.js';

// TODO:
// use browser api to get lat/lng

class SettingsActions {
  // this way! go to server here and dispatch all staff here!
  fetchSettings() {
    let request = SettingsSource.fetchSettings();
    request
      .then((response) => this.actions.updateSettings(response.data))
      .catch((response) =>  this.actions.settingsFailed(response.statusText));
  }

  getAllSettings() {
    this.dispatch();
  }

  updateSettings(settings) {
    this.dispatch(settings);
  }

  updateSettingsValue(option) {
    this.dispatch(option);

    // something wrong. Data set, but no updated in display
    let request = SettingsSource.updateSettingsValue(option);
    request
      .then((response) => this.actions.fetchSettings())
      .catch((response) =>  this.actions.settingsFailed(response.statusText));
  }

  settingsFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default dispatcher.createActions(SettingsActions);
