import axios from 'axios';
import {API_URL} from '../constants/App.js';

let SettingsSource = {
  fetchSettings() {
    let request = axios.get(`${API_URL}/settings`);
    return request;
  },

  updateSettingsValue(option) {
    let request = axios.post(`${API_URL}/${option.key}`, {
      code: option.value
    });
    return request;
  }
};

export default SettingsSource;
