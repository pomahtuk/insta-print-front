import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramStore from '../stores/InstagramStore';
import InstagramActions from '../actions/InstagramActions';
import Router from 'react-router';

let MachineUserPhotos = React.createClass({
  mixins: [ Router.State ],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState() {
    return {
      userId: null,
      settings: {},
      userPhotos: []
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.listen(this._onChange.bind(this, 'userPhotos', InstagramStore));

    SettingsActions.fetchSettings();

    let userId = this.context.router.getCurrentParams().userId;
    this.setState({
      userId: userId
    });
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'userPhotos', InstagramStore));
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};

      if (key === 'userPhotos') {
        updateObj[key] = store.getUserPhotos();
      } else {
        updateObj[key] = store.getData();
      }

      console.log(updateObj);

      this.setState(updateObj);
    }
  },

  _getPhotos() {
    let apiKey = this.state.settings['api-key'];
    let userId = '';
    if (apiKey) {
      InstagramActions.getUserPhotos(userId, apiKey);
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
        <button onClick={this._getPhotos}>Get photos!</button>
        <ul>
          {this.state.userPhotos.map(this._toList, this)}
        </ul>
      </div>
    );
  }
});

export default MachineUserPhotos;
