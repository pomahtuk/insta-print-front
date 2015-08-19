import axios from 'axios';
import {API_URL} from '../constants/App.js';

let PrintingSource = {
  printCartImages(images) {
    let request = axios.post(`${API_URL}/printer`, {
      images: images
    });
    return request;
  }
};

export default PrintingSource;
