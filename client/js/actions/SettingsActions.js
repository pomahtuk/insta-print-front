import dispatcher from '../dispatcher/appDispatcher.js';

class SettingsActions {
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
