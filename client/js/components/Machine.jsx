import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramStore from '../stores/InstagramStore';
import InstagramActions from '../actions/InstagramActions';

let Machine = React.createClass({
  getInitialState() {
    return {
      settings: {},
      locationImages: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.listen(this._onChange.bind(this, 'locationImages', InstagramStore));

    SettingsActions.fetchSettings();
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'locationImages', InstagramStore));
  },

  componentWillUpdate(nextProps, nextState) {
    let {settings} = nextState,
      oldSettings = this.state.settings,
      oldApiKey = oldSettings['api-key'],
      oldLocationId = oldSettings['location-id'],
      apiKey = settings['api-key'],
      locationId = settings['location-id'];

    let newValuesDiffer = (apiKey !== oldApiKey) && (locationId !== oldLocationId);

    if (newValuesDiffer && apiKey && locationId) {
      InstagramActions.getLocationImages(locationId, apiKey);
    }
  },

  /* Store events */
  _onChange(key, store) {
    let updateObj = {};

    if (key === 'locationImages') {
      updateObj[key] = store.getLocationImages();
    } else {
      updateObj[key] = store.getData();
    }

    console.log('store update received', updateObj);

    this.setState(updateObj);
  },

  _toDisplayImage(locationImage) {
    let {standard_resolution, high_resolution} = locationImage.images;
    let workImage = high_resolution || standard_resolution;

    return (
      <img
        className="main-screen-photos--image"
        key={locationImage.id}
        src={workImage.url}
        width={workImage.height}
        height={workImage.width}
      />
    );
  },

  render() {
    let {state} = this;

    return (
      <div className="main-screen-photos">
        {state.locationImages.map(this._toDisplayImage, this)}
      </div>
    );
  }
});

export default Machine;
