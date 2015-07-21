import SettingsActions from '../actions/SettingsActions';
import $ from 'jquery';

import {API_URL} from '../constants/App.js';

var mockData = [
  { id: 0, key: 'api-key', value: '1' },
  { id: 1, key: 'location-id', value: '2' },
];

let SettingsSource = {
  fetchSettings() {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          let jqxhr = $.getJSON(`${API_URL}/settings`, function(data) {
            $.extend(mockData, data);
            console.log(mockData, data);
            resolve(mockData);
          });

          jqxhr.fail(function (e) {
            console.log('ajax failed');
            reject(e);
          });
        });
      },

      local() {
        // Never check locally, always fetch remotely.
        return null;
      },

      success: SettingsActions.updateSettings,
      error: SettingsActions.settingsFailed,
      loading: SettingsActions.getAllSettings
    }
  },

  updateSettingsValue(key) {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          // simulate an asynchronous flow where data is fetched on
          // a remote server somewhere.
          setTimeout(function () {
            resolve(mockData);
          }, 2500);
        });
      },

      local() {
        return null;
      },

      success: SettingsActions.updateSettings,
      error: SettingsActions.settingsFailed
    }
  }
};

export default SettingsSource;
