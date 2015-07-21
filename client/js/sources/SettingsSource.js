import SettingsActions from '../actions/SettingsActions';
import $ from 'jquery';

import {API_URL} from '../constants/App.js';

var defaultData = [
  { id: 0, key: 'api-key', value: '' },
  { id: 1, key: 'location-id', value: '' },
];

let SettingsSource = {
  fetchSettings() {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          let xhr = $.getJSON(`${API_URL}/settings`, function(data) {
            let result = $.extend(defaultData, data);
            resolve(result);
          });

          xhr.fail(function (e) {
            console.log('ajax failed on get');
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

  updateSettingsValue(option = {}) {
    return {
      remote() {
        return new Promise(function (resolve, reject) {
          let xhr = $.post(`${API_URL}/${option.key}`, function(data) {
            let newData = {};
            newData[data.key] = data.value;

            let result = $.extend(defaultData, newData);
            resolve(result);
          });

          xhr.fail(function (error) {
            console.log('ajax failed on post');
            reject(error);
          });

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
