import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserPhotosStore from '../stores/InstagramUserPhotosStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramUserPhotosActions from '../actions/InstagramUserPhotosActions';
import Router from 'react-router';

import UserBlock from '../components/Machine/UserBlock.jsx';
import ImageBlock from '../components/Machine/ImageBlock.jsx';
import { Link } from 'react-router';

import classnames from 'classnames';

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
      userPhotosData: {
        userPhotos: {
          data: []
        },
        fullUpdate: false,
        error: null
      }
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserPhotosStore.listen(this._onChange.bind(this, 'userPhotosData', InstagramUserPhotosStore));

    SettingsActions.fetchSettings();
  },

  componentWillMount() {
    let userId = this.context.router.getCurrentParams().userId;
    this.setState({
      userId: userId
    });
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserPhotosStore.unlisten(this._onChange.bind(this, 'userPhotosData', InstagramUserPhotosStore));
    InstagramUserPhotosActions.clearUserPhotos();
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();

      if (key === 'userPhotosData') {
        let {userPhotos, error} = updateObj[key];
        if (userPhotos && userPhotos.data) {
          let {userPhotos, fullUpdate} = updateObj[key];
          updateObj.loaded = true;
          // only do a preloading on a full update
          if (fullUpdate) {
            InstagramUserPhotosActions.preloadPhotos(userPhotos.data);
          }
        } else if (error) {
          updateObj.loaded = true;
        }
      } else {
        let apiKey = updateObj[key]['api-key'];
        let userId = this.state.userId;
        if (apiKey && userId) {
          InstagramUserPhotosActions.getUserPhotos(userId, apiKey);
        }
      }

      this.setState(updateObj);
    }
  },

  _getPhotos() {
    let apiKey = this.state.settings['api-key'];
    let userId = this.state.userId;
    if (apiKey && userId) {
      InstagramUserPhotosActions.getUserPhotos(userId, apiKey);
    }
  },

  _toDisplayImage(userImage, index) {
    return (
      <ImageBlock
        className="1111"
        key={userImage.id}
        index={index}
        userImage={userImage}
        colCount={3}
        paddingValue={5}
      />
    );
  },


  _getUserBlock() {
    // hardcoding user for testing
    // but it's better to create an ajax call to get users if nothing found
    let user = InstagramUserStore.getUser(this.state.userId) || {
      full_name: 'Илья Ловряков',
      id: '1427599199',
      profile_picture: 'https://igcdn-photos-c-a.akamaihd.net/hphotos-ak-xap1/t51.2885-19/10561053_1464421077148970_1122327670_a.jpg',
      username: 'i_am_pomahtuk'
    };

    return (
      <div className="user-photos__user-container">
        <UserBlock
          user={user}
          linkTo="userPhotos"
          linkParams={{userId: user.id}}
        />
      </div>
    );
  },

  render() {
    let {userPhotosData, loaded} = this.state;
    let {data} = userPhotosData.userPhotos;
    let {error} = userPhotosData;

    let classNames = 'app app-bg user-photos-screen';

    let user = this._getUserBlock();

    // show user details
    // infinite scroll and preloading

    if (!loaded) {
      return (
        <div className={classNames}>
          {user}
          <div className="cssload-container">
            <div className="cssload-lt"></div>
            <div className="cssload-rt"></div>
            <div className="cssload-lb"></div>
            <div className="cssload-rb"></div>
          </div>
        </div>
      );
    } else if (error) {
      return (
        <div className={classNames}>
          {user}
          <span>
            According to user privacy settings you are not allowed to view this photos
          </span>
        </div>
      );
    } else {
      return (
        <div className={classNames}>
          <Link to="users" className="navigation-link">Back!</Link>
          {user}
          <div className="user-photos-screen__images-container">
            {data.map(this._toDisplayImage, this)}
          </div>
        </div>
      );
    }
  }
});

export default MachineUserPhotos;
