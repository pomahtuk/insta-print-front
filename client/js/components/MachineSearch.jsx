import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramTagStore from '../stores/InstagramTagStore';
import InstagramUserActions from '../actions/InstagramUserActions';
import InstagramTagsActions from '../actions/InstagramTagsActions';

import UserBlock from '../components/Machine/UserBlock.jsx';

import { Link } from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

let MachineSearch = React.createClass({
  getInitialState() {
    return {
      query: '',
      settings: {},
      locationImages: [],
      users: [],
      tags: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserStore.listen(this._onChange.bind(this, 'users', InstagramUserStore));
    InstagramTagStore.listen(this._onChange.bind(this, 'tags', InstagramTagStore));

    SettingsActions.fetchSettings();
  },

  componentWillMount() {
    this._getUsers = _.debounce(this._getUsers, 200);
    this._getTags = _.debounce(this._getTags, 200);
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserStore.unlisten(this._onChange.bind(this, 'users', InstagramUserStore));
    InstagramTagStore.unlisten(this._onChange.bind(this, 'tags', InstagramTagStore));
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

  _getTags() {
    let apiKey = this.state.settings['api-key'];
    let {query} = this.state;

    if (apiKey && query.length >= 3) {
      InstagramTagsActions.searchTags(query, apiKey);
    }
  },

  _toUserList(user, index) {
    return (
      <li className="found-users-container__user" key={user.id}>
        <UserBlock
          user={user}
          linkTo={`/search/user/${user.id}`}
        />
      </li>
    );
  },

  _toTagList(tag, index) {
    return (
      <li className="found-users-container__tag" key={index}>
        {tag.name}
      </li>
    );
  },

  _handleInputChange(event) {
    let value = event.target.value;

    this.setState({query: value});
    this._getUsers();
    this._getTags();
  },

  render() {
    let {query, users, tags} = this.state;

    users = users ? users : [];

    let inputClassNames = classnames({
      'user-search-screen__input': true,
      'user-search-screen__input--useers-found': users.length > 0
    });

    return (
      <div className="app app-bg user-search-screen">
        <input
          value={query}
          type="text"
          name="query"
          className={inputClassNames}
          onChange={this._handleInputChange}
        />
        <ul className="found-users-container">
          {users.map(this._toUserList, this)}
        </ul>
        <ul className="found-tags-container">
          {tags.map(this._toTagList, this)}
        </ul>
      </div>
    );
  }
});

export default MachineSearch;
