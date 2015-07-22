import dispatcher from '../dispatcher/appDispatcher.js';

var defaultData = {
  'api-key': '1',
  'location-id': '2'
}

class SettingsActions {
  // this way! go to server here and dispatch all staff here!
  fetchSettings() {
    this.actions.updateSettings(defaultData);
  }

  getAllSettings() {
    this.dispatch()
  }

  updateSettings(settings) {
    this.dispatch(settings)
  }

  updateSettingsValue(option) {
    this.dispatch(option);
  }

  settingsFailed(errorMessage) {
    this.dispatch(errorMessage)
  }
}

export default dispatcher.createActions(SettingsActions);
