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
    let queryObjext = router.getCurrentQuery();
    if (queryObjext.code) {
      SettingsActions.updateSettingsValue({
        key: 'api-key',
        value: queryObjext.code
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
      settings: GeoStore.getCoordinates()
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
        <ToolsButtons settings={this.state.settings} coordinates={this.state.coordinates} />
        <ToolsMap settings={this.state.settings} coordinates={this.state.coordinates} />
      </div>
    );
  }
});

export default Tools;
