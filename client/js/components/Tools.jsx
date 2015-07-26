import SettingsActions from '../actions/SettingsActions';
import GeoActions from '../actions/GeoActions';
import SettingsStore from '../stores/SettingsStore';
import GeoStore from '../stores/GeoStore';
import InstagramStore from '../stores/InstagramStore';
import InstagramActions from '../actions/InstagramActions';

import React from 'react/addons';
import Router from 'react-router';

import ToolsButtons from './Tools/ToolsButtons.jsx';
import ToolsMap from './Tools/ToolsMap.jsx';

let Tools = React.createClass({
  mixins: [ Router.State ],

  getInitialState() {
    return {
      initilaCoolrds: true,
      settings: {},
      coordinates: {},
      locations: [],
      oldCoords: {}
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    GeoStore.listen(this._onChange.bind(this, 'coordinates', GeoStore));
    InstagramStore.listen(this._onChange.bind(this, 'locations', InstagramStore));

    SettingsActions.fetchSettings();
    GeoActions.getCoordinates();

    // handle instagram auth token
    const {router} = this.context;
    let token = window.location.hash.split('=')[1];

    if (token && token !== this.state.settings['api-key']) {
      SettingsActions.updateSettingsValue({
        key: 'api-key',
        value: token
      });
    }
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    GeoStore.unlisten(this._onChange.bind(this, 'coordinates', GeoStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'locations', InstagramStore));
  },

  /* Store events */
  _onChange(key, store) {
    let updateObj = {};
    updateObj[key] = store.getData();

    if (key === 'coordinates') {
      // if this is first update - set initial to oldCoords
      if (this.state.coordinates.latitude) {
        updateObj.oldCoords = this.state.coordinates;
        updateObj.initilaCoolrds = false;
      } else {
        updateObj.oldCoords = store.getData();
        updateObj.initilaCoolrds = true;
      }
    }

    if (key === 'locations') {
      updateObj.initilaCoolrds = false;
    }

    this.setState(updateObj);
  },

  render() {
    let {coordinates, settings, oldCoords, initilaCoolrds} = this.state;
    let {latitude, longitude} = coordinates;
    let apiKey = settings['api-key'];
    // call Action only if coords changed
    let coordsDiffer = (latitude !== oldCoords.latitude || longitude !== oldCoords.longitude);

    if (apiKey && latitude && longitude && (coordsDiffer || initilaCoolrds)) {
      InstagramActions.searchLocations(latitude, longitude, apiKey);
    }

    // console.log(this.state.locations);

    return (
      <ToolsMap
        settings={this.state.settings}
        coordinates={this.state.coordinates}
        locations={this.state.locations}
      />
    );
  }
});

export default Tools;
