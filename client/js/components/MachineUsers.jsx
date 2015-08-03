import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramUserActions from '../actions/InstagramUserActions';
import { Link } from 'react-router';
import _ from 'lodash';

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

  componentWillMount() {
    this._getUsers = _.debounce(this._getUsers, 200);
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserStore.unlisten(this._onChange.bind(this, 'users', InstagramUserStore));
  },

  componentWillUpdate(nextProps, nextState) {
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();
      this.setState(updateObj);
    }
  },

  _getUsers() {
    let apiKey = this.state.settings['api-key'];
    let {query} = this.state;

    if (apiKey && query.length >= 3) {
      InstagramUserActions.searchUsers(query, apiKey);
    }
  },

  _toList(user, index) {
    return (
      <li key={user.id}>
        <Link to="userPhotos" params={{userId: user.id}}>
          <img src={user.profile_picture} />
          <br/>
          <span>
            @{user.username} - {user.full_name}
          </span>
        </Link>
      </li>
    );
  },

  _handleInputChange(event) {
    let value = event.target.value;

    this.setState({query: value});
    this._getUsers();
  },

  render() {
    let {query, users} = this.state;

    users = users ? users : [];

    return (
      <div className="main-screen-users">
        <input value={query} type="text" name="query" onChange={this._handleInputChange}/>
        <ul>
          {users.map(this._toList, this)}
        </ul>
      </div>
    );
  }
});

export default MachineUsers;
