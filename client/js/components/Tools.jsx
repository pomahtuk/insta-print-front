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
import Navigation from './Navigation.jsx';

let Tools = React.createClass({
  mixins: [ Router.State ],

  getInitialState() {
    return {
      settings: {},
      geo: {
        coordinates: {},
        zoom: 18
      },
      locations: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    GeoStore.listen(this._onChange.bind(this, 'geo', GeoStore));
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
    GeoStore.unlisten(this._onChange.bind(this, 'geo', GeoStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'locations', InstagramStore));
  },

  componentWillUpdate(nextProps, nextState) {
    let {geo, settings} = nextState,
      {coordinates} = geo,
      {latitude, longitude} = coordinates,
      oldCoords = this.state.geo.coordinates,
      apiKey = settings['api-key'];

    let coordsDiffer = (latitude !== oldCoords.latitude || longitude !== oldCoords.longitude);

    if (apiKey && latitude && longitude && coordsDiffer) {
      InstagramActions.searchLocations(latitude, longitude, apiKey);
    }
  },

  /* Store events */
  _onChange(key, store) {
    let updateObj = {};
    updateObj[key] = store.getData();
    this.setState(updateObj);
  },

  render() {
    let {geo, settings, oldCoords, locations} = this.state;

    return (
      <div className="app">

        <Navigation />

        <div className="app-content">
          <ToolsMap
            settings={settings}
            geo={geo}
            locations={locations}
          />
        </div>

      </div>
    );
  }
});

export default Tools;
