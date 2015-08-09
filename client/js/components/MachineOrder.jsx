import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramUserActions from '../actions/InstagramUserActions';

import { Link } from 'react-router';
import classnames from 'classnames';

let MachineUsers = React.createClass({
  getInitialState() {
    return {
      query: '',
      settings: {},
      locationImages: [],
      users: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserStore.listen(this._onChange.bind(this, 'users', InstagramUserStore));

    SettingsActions.fetchSettings();
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserStore.unlisten(this._onChange.bind(this, 'users', InstagramUserStore));
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();
      this.setState(updateObj);
    }
  },

  render() {
    return (
      <div className="app app-bg user-search-screen">
        222
      </div>
    );
  }
});

export default MachineUsers;
