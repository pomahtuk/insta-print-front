import dispatcher from '../dispatcher/appDispatcher.js';

class SettingsActions {
  // this way! go to server here and dispatch all staff here!

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
