import SettingsActions from '../../actions/SettingsActions';
import InstagramActions from '../../actions/InstagramActions';
import SettingsStore from '../../stores/SettingsStore';
import InstagramStore from '../../stores/InstagramStore';

import React from 'react/addons';
import Router from 'react-router';
import {GoogleMaps, InfoWindow, Marker} from 'react-google-maps';
import MapLocationsList from './MapLocationsList.jsx';

// TODO: loading state!
let ToolsMap = React.createClass({
  getInitialState () {
    return {
      zoomLevel: 18,
      settings: {},
      coordinates: {
        latitude: 52.365667099999996,
        longitude: 4.8983713
      },
      locations: [{
        latitude: 52.365556619,
        id: '312287221',
        longitude: 4.898041384,
        name: 'The Bank, Amsterdam'
      }]
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

  // all map related actions
  _handle_location_click (location) {
    location.showInfo = true;
    this.setState(this.state);
  },

  _handle_closeclick (location) {
    location.showInfo = false;
    this.setState(this.state);
  },

  _handle_zoom_changed () {
    const zoomLevel = this.refs.map.getZoom();
    if (zoomLevel !== this.state.zoomLevel) {
      // Notice: Check zoomLevel equality here,
      // or it will fire zoom_changed event infinitely
      this.setState({
        zoomLevel
      });
    }
  },

  _handle_center_change (event) {
    const center = this.refs.map.getCenter();
    const {coordinates} = this.state;
    let {latitude, longitude} = coordinates;
    let newLatitude = center.lat();
    let newLongitude = center.lng();
    let coordsPresent = latitude && longitude;

    if (coordsPresent && (latitude !== newLatitude || longitude !== newLongitude)) {
      this.setState({
        coordinates: {
          latitude: newLatitude,
          longitude: newLongitude
        }
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

    function toMarker (location, index) {
      return (
        <Marker
          position={{lat: location.latitude, lng: location.longitude}}
          key={location.id}
          ref={location.id}
          onClick={this._handle_location_click.bind(this, location)}>

          {renderInfoWindow.call(this, location)}

        </Marker>
      );
    }

    function renderInfoWindow (location) {
      var ref = location.id;
      return location.showInfo ? <InfoWindow key={`${ref}_info_window`} owner={ref} content={location.name} onCloseclick={this._handle_closeclick.bind(this, location)} /> : null;
    }


    return (
      <div className='flexi-wrapper'>
        <GoogleMaps containerProps={{
            ...otherProps,
            className: 'main-content'
          }}
          ref="map"
          googleMapsApi={
            typeof google !== 'undefined' ? google.maps : null
          }
          zoom={state.zoomLevel}
          onDragend={this._handle_center_change}
          onZoomChanged={this._handle_zoom_changed}
          center={{lat: latitude, lng: longitude}}
        >

          {state.locations.map(toMarker, this)}

        </GoogleMaps>
        <MapLocationsList locations={state.locations} />
      </div>
    );
  }
});

export default ToolsMap;
