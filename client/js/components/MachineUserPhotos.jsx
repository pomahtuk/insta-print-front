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
      loaded: false,
      userId: null,
      settings: {},
      userPhotos: {}
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.listen(this._onChange.bind(this, 'userPhotos', InstagramStore));

    SettingsActions.fetchSettings();
  },

  componentWillMount() {
    let userId = this.context.router.getCurrentParams().userId;
    this.setState({
      userId: userId,
      userPhotos: {},
      loaded: false
    });
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramStore.unlisten(this._onChange.bind(this, 'userPhotos', InstagramStore));
    InstagramActions.clearUserPhotos();
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};

      if (key === 'userPhotos') {
        updateObj[key] = store.getUserPhotos();
        if (updateObj[key] && updateObj[key].data) {
          updateObj.loaded = true;
        }
      } else {
        updateObj[key] = store.getData();

        let apiKey = updateObj[key]['api-key'];
        let userId = this.state.userId;

        if (apiKey && userId) {
          InstagramActions.getUserPhotos(userId, apiKey);
        }

      }

      this.setState(updateObj);
    }
  },

  _getPhotos() {
    let apiKey = this.state.settings['api-key'];
    let userId = this.state.userId;
    if (apiKey && userId) {
      InstagramActions.getUserPhotos(userId, apiKey);
    }
  },

  _toDisplayImage(userImage, index) {
    let {standard_resolution, high_resolution} = userImage.images,
      workImage = high_resolution || standard_resolution,
      colCount = 4,
      colItemWidth = window.innerWidth / colCount;

    return (
      <img
        className="main-screen-photos--image"
        key={userImage.id}
        src={`${userImage.link}media/?size=l`}
        width={colItemWidth}
        height={colItemWidth}
      />
    );
  },

  render() {
    let {userPhotos, loaded} = this.state;
    let {data} = userPhotos;

    if (!loaded) {
      return (
        <div>
          <img src="/ajax-loader.gif"/>
        </div>
      );
    } else {
      return (
        <div className="main-screen-users">
          <button onClick={this._getPhotos}>Get photos!</button>
          <ul>
            {data.map(this._toDisplayImage, this)}
          </ul>
        </div>
      );
    }
  }
});

export default MachineUserPhotos;
