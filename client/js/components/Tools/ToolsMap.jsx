import SettingsActions from '../../actions/SettingsActions';
import InstagramActions from '../../actions/InstagramActions';
import SettingsStore from '../../stores/SettingsStore';
import InstagramStore from '../../stores/InstagramStore';

import React from "react/addons";
import Router from 'react-router';
import {GoogleMaps, Marker} from "react-google-maps";

// TODO: loading state!
let ToolsMap = React.createClass({
  getInitialState () {
    return {
      settings: {},
      coordinates: {
        latitude: 52.365667099999996,
        longitude: 4.8983713
      },
      locations: [{
        latitude: 52.365556619,
        id: "312287221",
        longitude: 4.898041384,
        name: "The Bank, Amsterdam"
      }],
    };
  },

  componentDidMount() {
    InstagramStore.listen(this._onInstagrammChange);
  },

  componentWillUnmount() {
    InstagramStore.unlisten(this._onInstagrammChange);
  },

  /* Store events */
  _onInstagrammChange() {
    this.setState({
      locations: InstagramStore.getLocations()
    });
  },
  // once parrent container receive state updates
  // we will be able to reflect this
  componentWillReceiveProps(nextProps) {
    let {coordinates, settings} = nextProps;
    let {latitude, longitude} = coordinates;
    let apiKey = settings['api-key'];

    if (apiKey && latitude && longitude) {
      InstagramActions.searchLocations(latitude, longitude, apiKey);
    }

    if (settings) {
      this.setState({
        settings: settings
      });
    }

    if (latitude && longitude) {
      this.setState({
        coordinates: coordinates
      });
    }

  },

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  render () {
    const {props, state} = this,
          {googleMapsApi, ...otherProps} = props,
          {coordinates, settings} = state,
          {latitude, longitude} = coordinates;

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
        zoom={16}
        center={{lat: latitude, lng: longitude}}>

        {state.locations.map(toMarker, this)}

      </GoogleMaps>
    );

    function toMarker (location, index) {
      return (
        <Marker
          position={{lat: location.latitude, lng: location.longitude}}
          key={location.id}
        />
      );
    }
  }
});

export default ToolsMap
