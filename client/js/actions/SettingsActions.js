import dispatcher from '../dispatcher/appDispatcher.js';

class SettingsActions {
  updateValue(key, value) {
    this.dispatch(key, value);
  }

  getValue(key) {
    this.dispatch(key);
  }

  getAllSettings() {
    this.dispatch()
  }

  updateSettings(settings) {
    this.dispatch(settings)
  }

  settingsFailed(errorMessage) {
    this.dispatch(errorMessage)
  }
}

export default dispatcher.createActions(SettingsActions);
