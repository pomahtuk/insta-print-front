import axios from 'axios';
import moment from 'moment';
import {INSTAGRAM_URL, PROXY_API_URL} from '../constants/App.js';

let InstagramSource = {
  /**
   * Making a request to Instagram API to fetch locations arounf current point
   *
   * DISTANCE	Default is 1000m (distance=1000), max distance is 5000.
   *
   * https://api.instagram.com/v1/locations/search?lat=48.858844&lng=2.294351&access_token=ACCESS-TOKEN
   *
   * @param  {Number} lat   [Lattitude of current location]
   * @param  {Number} lng   [longtitude on current location]
   * @param  {String} token [acess token for all requests]
   * @return {Promise}      [Ajax Promise]
   */
  searchLocations(lat, lng, token) {
    let request = axios.get(`${PROXY_API_URL}`, {
      params: {
        url: `${INSTAGRAM_URL}/locations/search`,
        lat: lat,
        lng: lng,
        access_token: token
      }
    });
    return request;
  },

  /**
   * Making a request to Instagram API to fetch users matching current query
   *
   * COUNT	Number of users to return.
   *
   * https://api.instagram.com/v1/users/search?q=jack&access_token=ACCESS-TOKEN
   *
   * @param  {String} query [Part of username to search for]
   * @param  {String} token [acess token for all requests]
   * @return {Promise}      [Ajax Promise]
   */
  searchUsers(query, token) {
    let request = axios.get(`${PROXY_API_URL}`, {
      params: {
        url: `${INSTAGRAM_URL}/users/search`,
        q: query,
        access_token: token
      }
    });
    return request;
  },

  /**
   * Making a request to Instagram API to fetch selected user's media
   *
   * COUNT	Count of media to return.
   * MIN_ID	Return media later than this min_id.
   * MAX_ID	Return media earlier than this max_id.
   *
   * https://api.instagram.com/v1/users/{user-id}/media/recent/?access_token=ACCESS-TOKEN
   *
   * @param  {String} userId [ID of selected user]
   * @param  {String} token  [acess token for all requests]
   * @return {Promise}       [Ajax Promise]
   */
  getUserMedia(userId, token) {
    let request = axios.get(`${PROXY_API_URL}`, {
      params: {
        url: `${INSTAGRAM_URL}/users/${userId}/media/recent/`,
        count: 50000,
        min_timestamp: Date.now() / 1000 - 60 * 60 * 24 * 365 * 5,
        max_timestamp: Date.now() / 1000,
        access_token: token
      }
    });
    return request;
  },

  /**
   * Making a request to Instagram API to get more user data
   *
   * @param  {String} url         [next formed url]
   * @return {Promise}            [Ajax Promise]
   */
  getMoreUserMedia(url) {
    let request = axios.get(`${PROXY_API_URL}`, {
      params: {
        url: url
      }
    });

    return request;
  },

  /**
   * Making a request to Instagram API to fetch selected media details
   *
   * https://api.instagram.com/v1/media/{media-id}?access_token=ACCESS-TOKEN
   *
   * @param  {String} mediaId [ID of media to fetch details]
   * @param  {String} token   [acess token for all requests]
   * @return {Promise}        [Ajax Promise]
   */
  getMediaDetails(mediaId, token) {
    let request = axios.get(`${INSTAGRAM_URL}/media/${mediaId}`, {
      params: {
        access_token: token
      }
    });
    return request;
  },

  /**
   * Making a request to Instagram API to fetch selected location recent medias
   *
   * https://api.instagram.com/v1/locations/{location-id}/media/recent?access_token=ACCESS-TOKEN
   *
   * @param  {String} locationId  [ID of location to fetch media]
   * @param  {String} token       [acess token for all requests]
   * @return {Promise}            [Ajax Promise]
   */
  getMediaForLocation(locationId, token) {
    let request = axios.get(`${PROXY_API_URL}`, {
      params: {
        url: `${INSTAGRAM_URL}/locations/${locationId}/media/recent`,
        access_token: token
      }
    });

    return request;
  },

  /**
   * Making a request to Instagram API to fetch media near current coords
   *
   * https://api.instagram.com/v1/media/search?access_token=ACCESS-TOKEN
   *
   * @param  {Number} lat   [Lattitude of current location]
   * @param  {Number} lng   [longtitude on current location]
   * @param  {String} token [acess token for all requests]
   * @return {Promise}      [Ajax Promise]
   */
  getMediaForLatLng(lat, lng, token) {
    let request = axios.get(`${PROXY_API_URL}`, {
      params: {
        url: `${INSTAGRAM_URL}/media/search`,
        lat: lat,
        lng: lng,
        distance: 200,
        access_token: token
      }
    });

    return request;
  }

};

export default InstagramSource;
