import dispatcher from '../dispatcher/appDispatcher.js';
import SettingsActions from  '../actions/SettingsActions';
import SettingsSource from  '../sources/SettingsSource';


class SettingsStore {
  constructor() {
    this.settings = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateSettings: SettingsActions.UPDATE_SETTINGS,
      handleGetAllSettings: SettingsActions.GET_ALL_SETTINGS,
      handleSettingsFailed: SettingsActions.SETTINGS_FAILED
    });

    this.exportPublicMethods({
      getOption: this.getOption
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
    this.settings = [];
  }

  getOption(key) {
    var { settings } = this.getState();

    var option = settings.filter( (option) => option.key === key );

    console.log(option);

    return option;
  }

}

export default dispatcher.createStore(SettingsStore, 'SettingsStore');
