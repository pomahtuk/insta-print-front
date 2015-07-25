import SettingsActions from '../actions/SettingsActions';
import GeoActions from '../actions/GeoActions';
import SettingsStore from '../stores/SettingsStore';
import GeoStore from '../stores/GeoStore';

import React from "react/addons";
import Router from 'react-router';

import ToolsButtons from './Tools/ToolsButtons.jsx';
import ToolsMap from './Tools/ToolsMap.jsx';

let Tools = React.createClass({
  mixins: [ Router.State ],

  getInitialState() {
    return {
      settings: {},
      coordinates: {}
    }
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange);
    SettingsActions.fetchSettings();

    GeoStore.listen(this._onLocationChange);
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
    SettingsStore.unlisten(this._onChange);
    GeoStore.unlisten(this._onLocationChange);
  },

  /* Store events */
  _onLocationChange() {
    this.setState({
      coordinates: GeoStore.getCoordinates()
    });
  },

  _onChange() {
    this.setState({
      settings: SettingsStore.getSettings()
    });
  },

  render() {
    return (
      <div>
        {/* list of locations will go here */}
        <ToolsMap settings={this.state.settings} coordinates={this.state.coordinates} />
      </div>
    );
  }
});

export default Tools;
