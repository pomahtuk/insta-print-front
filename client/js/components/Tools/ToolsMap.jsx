import SettingsActions from '../../actions/SettingsActions';
import SettingsStore from '../../stores/SettingsStore';

import React from "react/addons";
import Router from 'react-router';
import {GoogleMaps, Marker} from "react-google-maps";

// TODO: loading state!
let ToolsMap = React.createClass({
  getInitialState () {
    return {
      coordinates: {
        latitude: 52.365667099999996,
        longitude: 4.8983713
      },
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

  // once parrent container receive state updates
  // we will be able to reflect this
  componentWillReceiveProps(nextProps) {
    let {coordinates} = nextProps;

    if (coordinates.latitude && coordinates.longitude) {
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
          {coordinates} = state,
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
        zoom={14}
        center={{lat: state.coordinates.latitude, lng: state.coordinates.longitude}}>

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

export default ToolsMap
