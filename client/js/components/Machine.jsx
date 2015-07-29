import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramStore from '../stores/InstagramStore';
import GeoStore from '../stores/GeoStore';
import GeoActions from '../actions/GeoActions';
import InstagramActions from '../actions/InstagramActions';

let Machine = React.createClass({
  getInitialState() {
    return {
      loaded: false,
      geo: {
        coordinates: {},
        zoom: 18
      },
      settings: {},
      locationImages: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.listen(this._onChange.bind(this, 'locationImages', InstagramStore));
    GeoStore.listen(this._onChange.bind(this, 'geo', GeoStore));

    SettingsActions.fetchSettings();
    GeoActions.getCoordinates();
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'locationImages', InstagramStore));
    GeoStore.unlisten(this._onChange.bind(this, 'geo', GeoStore));
  },

  componentWillUpdate(nextProps, nextState) {
    let {geo, settings} = nextState,
      oldSettings = this.state.settings,
      oldApiKey = oldSettings['api-key'],
      apiKey = settings['api-key'],
      {coordinates} = geo,
      {latitude, longitude} = coordinates,
      oldCoords = this.state.geo.coordinates;

    let coordsDiffer = (latitude !== oldCoords.latitude || longitude !== oldCoords.longitude);

    if (apiKey && latitude && longitude && coordsDiffer) {
      InstagramActions.getImagesForCoordinates(latitude, longitude, apiKey);
    }
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};

      if (key === 'locationImages') {
        updateObj[key] = store.getLocationImages();
      } else {
        updateObj[key] = store.getData();
      }

      if (key === 'geo' && updateObj[key] && updateObj[key].coordinates) {
        updateObj.loaded = true;
      }

      this.setState(updateObj);
    }
  },

  _toDisplayImage(locationImage, index) {
    let {standard_resolution, high_resolution} = locationImage.images,
      workImage = high_resolution || standard_resolution,
      colCount = 4,
      colItemWidth = window.innerWidth / colCount;

    return (
      <img
        className="main-screen-photos--image"
        key={locationImage.id}
        src={`${locationImage.link}media/?size=l`}
        width={colItemWidth}
        height={colItemWidth}
      />
    );
  },

  render() {
    let {state} = this;

    if (!state.loaded) {
      return (
        <div>
          <img src="/ajax-loader.gif"/>
        </div>
      );
    }

    return (
      <div className="main-screen-photos">
        {state.locationImages.map(this._toDisplayImage, this)}
      </div>
    );
  }
});

export default Machine;
