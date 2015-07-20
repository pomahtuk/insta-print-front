import AltContainer from 'alt/AltContainer';
import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

import React from "react/addons";
import Router from 'react-router';
import {GoogleMaps, Marker} from "react-google-maps";

const {update} = React.addons;

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
    console.log(this.props.settings);

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
        <ToolsMap />
      </AltContainer>
    );
  }
};

export default Tools;
