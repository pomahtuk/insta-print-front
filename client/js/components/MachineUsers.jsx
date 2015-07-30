import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramStore from '../stores/InstagramStore';
import InstagramActions from '../actions/InstagramActions';

let MachineUsers = React.createClass({
  getInitialState() {
    return {
      settings: {},
      locationImages: [],
      users: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.listen(this._onChange.bind(this, 'users', InstagramStore));

    SettingsActions.fetchSettings();
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'users', InstagramStore));
  },

  componentWillUpdate(nextProps, nextState) {
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};

      if (key === 'users') {
        updateObj[key] = store.getUsers();
      } else {
        updateObj[key] = store.getData();
      }

      console.log(updateObj);

      this.setState(updateObj);
    }
  },

  _getUsers() {
    let apiKey = this.state.settings['api-key'];
    if (apiKey) {
      InstagramActions.searchUsers('i_am_', apiKey);
    }
  },

  _toList(user, index) {
    return (
      <li key={user.id}>
        <img src={user.profile_picture} />
        <br/>
        <span>
          @{user.name} - {user.full_name}
        </span>
      </li>
    );
  },

  render() {
    return (
      <div className="main-screen-users">
        <button onClick={this._getUsers}>Get users!</button>
        <ul>
          {this.state.users.map(this._toList, this)}
        </ul>
      </div>
    );
  }
});

export default MachineUsers;
