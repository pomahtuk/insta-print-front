import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramTagStore from '../stores/InstagramTagStore';
import InstagramUserActions from '../actions/InstagramUserActions';
import InstagramTagsActions from '../actions/InstagramTagsActions';

import UserBlock from '../components/Machine/UserBlock.jsx';
import Keyboard from '../components/Machine/Keyboard.jsx';

import { Link, Navigation } from 'react-router';
import { List, ListItem, Avatar } from 'material-ui';

import {THEME_MANAGER} from '../constants/App';

import _ from 'lodash';
import classnames from 'classnames';

let MachineSearch = React.createClass({
  mixins: [Navigation],

  getInitialState() {
    return {
      query: '',
      settings: {},
      locationImages: [],
      users: [],
      tags: []
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: THEME_MANAGER.getCurrentTheme()
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
          linkTo="photos"
          query={{
            itemId: user.id
          }}
          params={{
            type: 'user'
          }}
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

  _processNewQuery(value) {
    this.setState({query: value});
    this._getUsers();
    this._getTags();
  },

  _handleInputChange(event) {
    let value = event.target.value;
    this._processNewQuery(value);
  },

  _goToPhotos(id, type) {
    setTimeout(() => {
      this.transitionTo('photos', {type: type}, {itemId: id});
    }, 500);
  },

  render() {
    let {query, users, tags} = this.state;

    users = users ? users : [];

    return (
      <div className="app-search user-search-screen">
        <div className="content-holder">
          <input
            value={query}
            type="text"
            name="query"
            className="user-search-screen__input"
            onChange={this._handleInputChange}
          />

          <div className="lists-wrapper">

            <List subheader="Users" className="users-list">
              {users.map((user) =>
                <ListItem
                  key={user.id}
                  leftAvatar={<Avatar src={user.profile_picture} />}
                  primaryText={user.username}
                  onClick={() => this._goToPhotos(user.id, 'user')}
                />
              )}
            </List>

            <List subheader="Tags" className="tags-list">
              {tags.map((tag) =>
                <ListItem
                  key={tag.name}
                  leftAvatar={<Avatar><i className="material-icons">share</i></Avatar>}
                  primaryText={tag.name}
                  onClick={() => this._goToPhotos(tag.name, 'tag')}
                />
              )}
            </List>

          </div>

        </div>
        <Keyboard parentValue={query} onChange={this._processNewQuery} />
      </div>
    );
  }
});

export default MachineSearch;
