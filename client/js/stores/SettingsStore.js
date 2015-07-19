import dispatcher from '../dispatcher/appDispatcher.js';
import SettingsActions from  '../actions/SettingsActions';
import SettingsSource from  '../sources/SettingsSource';


class SettingsStore {
  constructor() {
    this.settings = {};
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateSettings: SettingsActions.UPDATE_LOCATIONS,
      handleGetAllSettings: SettingsActions.GET_ALL_SETTINGS,
      handleSettingsFailed: SettingsActions.SETTINGS_FAILED
    });

    this.exportPublicMethods({
      getValue: this.getValue,
      setValue: this.setValue
    });

    this.exportAsync(SettingsSource);
  }

  handleSettingsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }

  handleUpdateSettings(settings) {
    this.settings = settings;
    this.errorMessage = null;
  }

  handleGetAllSettings() {
    this.settings = {};
  }

  // this looks fine
  getValue(key) {
    var { settings } = this.getState();
    return settings.filter(item => item.key === key);
  }

  // nope^ this will update a runtime, not server
  setValue(key, value) {
    var { settings } = this.getState();
    var item = settings.filter(item => item.key === key);
    item.value = value;
    this.setState({
      settings: settings
    });
  }
}

export default dispatcher.createStore(SettingsStore, 'SettingsStore');
