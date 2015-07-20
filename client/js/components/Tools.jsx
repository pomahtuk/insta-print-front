import AltContainer from 'alt/AltContainer';
import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

import React from "react/addons";
import Router from 'react-router';
import {GoogleMaps, Marker} from "react-google-maps";

let ToolsButtons = React.createClass({

  // some state has to be initial
  getInitialState () {
    return {};
  },

  // this will be on update of each Flux store
  componentWillReceiveProps(nextProps) {
    let settings = nextProps.settings;
    let newStateObj = {};

    // this needed to let input work
    settings.map((option) => newStateObj[option.key] = option.value);

    this.setState(newStateObj);
  },

  // just mock method
  _updateSettings (option) {
    console.log(option.key);
  },

  // we need to update state value on input change
  _handleInputChange (option) {
    let updateObject = {};
    updateObject[option.key] = event.target.value;
    this.setState(updateObject);
  },

  render () {

    // show spinner while getting response from server
    if (SettingsStore.isLoading()) {
      return (
        <div>
          <img src="images/ajax-loader.gif" />
        </div>
      )
    }

    // once we have settings available - render
    return (
      <div>
        <div className="input-container">
          { /* mapping all settings to coresponding input component representation*/ }
          {this.props.settings.map((option, index) => toInputs.call(this, option, index))}
        </div>
      </div>
    );

    // function which renders input groups
    function toInputs(option, index) {
      return (
        <div className="input-container">
          <input type="text" dafaultValue={option.value} value={this.state[option.key]} htmlFor={option.key} onChange={this._handleInputChange.bind(this, option)} />
          <button onClick={this._updateSettings.bind(this, option)}>Update</button>
        </div>
      )
    }

  }
});

let ToolsMap = React.createClass({
  mixins: [ Router.State ],

  getInitialState () {
    return {
      markers: [{
        position: {
          lat: 25.0112183,
          lng: 121.52067570000001,
        },
        key: "Taiwan",
        animation: 2
      }],
    };
  },

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  render () {
    const {props, state} = this,
          {googleMapsApi, ...otherProps} = props;

    // console.log(this.context.router.getCurrentQuery());
    // console.log(this.props.settings);

    if (SettingsStore.isLoading()) {
      return (
        <div>
          <img src="images/ajax-loader.gif" />
        </div>
      )
    }

    return (
      <GoogleMaps containerProps={{
          ...otherProps,
          style: {
            height: "600px",
          },
        }}
        ref="map"
        googleMapsApi={
          "undefined" !== typeof google ? google.maps : null
        }
        zoom={3}
        center={{lat: -25.363882, lng: 131.044922}}>

        {state.markers.map(toMarker, this)}

      </GoogleMaps>
    );

    function toMarker (marker, index) {
      return (
        <Marker
          position={marker.position}
          key={marker.key}
          animation={marker.animation}
        />
      );
    }
  }
});

class Tools extends React.Component {
  componentDidMount() {
    SettingsStore.fetchSettings();
  }

  render() {
    return (
      <AltContainer store={SettingsStore}>
        <ToolsButtons />
        <ToolsMap />
      </AltContainer>
    );
  }
};

export default Tools;
