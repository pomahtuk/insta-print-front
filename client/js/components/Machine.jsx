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
    console.log('mounted');

    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.listen(this._onChange.bind(this, 'locationImages', InstagramStore));

    SettingsActions.fetchSettings();
    // InstagramActions.getLocationImages();
  },

  componentWillUnmount() {
    console.log('un-mounted');

    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'locationImages', InstagramStore));
  },

  componentWillUpdate(nextProps, nextState) {
    console.log('updated');

    let {settings} = nextState,
      oldSettings = this.state.settings,
      oldApiKey = oldSettings['api-key'],
      oldLocationId = oldSettings['location-id'],
      apiKey = settings['api-key'],
      locationId = settings['location-id'];

    let newValuesDiffer = (apiKey !== oldApiKey) && (locationId !== oldLocationId);

    console.log(newValuesDiffer);

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

  render() {
    return (
      <div>
        home page
      </div>
    );
  }
});

export default Machine;
