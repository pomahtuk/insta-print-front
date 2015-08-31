import SettingsActions from '../../actions/SettingsActions';
import GeoActions from '../../actions/GeoActions';
import SettingsStore from '../../stores/SettingsStore';
import GeoStore from '../../stores/GeoStore';
import InstagramStore from '../../stores/InstagramStore';
import InstagramActions from '../../actions/InstagramActions';

import React from 'react/addons';
import Router from 'react-router';
import {GoogleMaps, InfoWindow, Marker} from 'react-google-maps';
import MapLocationsList from './MapLocationsList.jsx';

import {STATIC_URL} from '../../constants/App.js';

// TODO: loading state!
let ToolsMap = React.createClass({
  getInitialState () {
    return {
      settings: {},
      defaultCoords: {
        latitude: 52.365667099999996,
        longitude: 4.8983713
      },
      geo: {
        coordinates: {
          latitude: 52.365667099999996,
          longitude: 4.8983713
        },
        zoom: 18
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
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    GeoStore.listen(this._onChange.bind(this, 'geo', GeoStore));
    InstagramStore.listen(this._onChange.bind(this, 'locations', InstagramStore));

    SettingsActions.fetchSettings();
    GeoActions.getCoordinates();
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
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();
      this.setState(updateObj);
    }
  },

  // all map related actions
  _setLocationHover (location, state) {
    InstagramActions.setLocationHoverState(location.id, state);
  },

  _handle_zoom_changed () {
    const zoomLevel = this.refs.map.getZoom();
    if (zoomLevel !== this.state.geo.zoom) {
      GeoActions.updateZoomLevel(zoomLevel);
    }
  },

  _handle_center_change (event) {
    const center = this.refs.map.getCenter();
    const {coordinates} = this.state.geo;
    let {latitude, longitude} = coordinates;
    let newLatitude = center.lat();
    let newLongitude = center.lng();
    let coordsPresent = latitude && longitude;

    if (coordsPresent && (latitude !== newLatitude || longitude !== newLongitude)) {
      GeoActions.updateCoordinates({
        latitude: newLatitude,
        longitude: newLongitude
      });
    }
  },

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  render () {
    let {props, state} = this,
      {googleMapsApi, ...otherProps} = props,
      {geo, settings, defaultCoords} = state,
      {latitude, longitude} = geo.coordinates;

    // fallback for initial coords
    if (!latitude) {
      latitude = defaultCoords.latitude;
      longitude = defaultCoords.longitude;
    }

    function toMarker (location, index) {
      return (
        <Marker
          position={{lat: location.latitude, lng: location.longitude}}
          key={location.id}
          ref={location.id}
          icon={'/marker.png'}
          onClick={this._setLocationHover.bind(this, location, true)}
        >

          {renderInfoWindow.call(this, location)}

        </Marker>
      );
    }

    function renderInfoWindow (location) {
      var ref = location.id;
      if (location.hovered) {
        return (
          <InfoWindow
            key={`${ref}_info_window`}
            owner={ref}
            content={location.name}
            onCloseclick={this._setLocationHover.bind(this, location, false)}
          />
        );
      }
      return null;
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
          zoom={geo.zoom}
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
