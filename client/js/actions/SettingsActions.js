import dispatcher from '../dispatcher/appDispatcher.js';

class SettingsActions {
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
