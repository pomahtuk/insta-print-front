import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramPhotosStore from '../stores/InstagramPhotosStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramPhotosActions from '../actions/InstagramPhotosActions';
import Router from 'react-router';

import UserBlock from '../components/Machine/UserBlock.jsx';
import ImageBlock from '../components/Machine/ImageBlock.jsx';
import { Link } from 'react-router';
import Waypoint from 'react-waypoint';

import classnames from 'classnames';

// add check for loading more images

let MachineUserPhotos = React.createClass({
  mixins: [ Router.State ],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState() {
    return {
      isInfiniteLoading: false,
      isInfiniteLoadingEnabled: false,
      loaded: false,
      userId: null,
      settings: {},
      photosData: {
        photos: {
          data: []
        },
        hasMorePhotos: true,
        fullUpdate: false,
        error: null
      }
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramPhotosStore.listen(this._onChange.bind(this, 'photosData', InstagramPhotosStore));

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
    InstagramPhotosStore.unlisten(this._onChange.bind(this, 'photosData', InstagramPhotosStore));
    InstagramPhotosActions.clearPhotos();
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();

      if (key === 'photosData') {
        let {photos, error} = updateObj[key];
        if (photos && photos.data) {
          let {photos, fullUpdate} = updateObj[key];
          updateObj.loaded = true;
          updateObj.isInfiniteLoading = false;
          // only do a preloading on a full update
          if (fullUpdate) {
            InstagramPhotosActions.preloadPhotos(photos.data);
          }
        } else if (error) {
          updateObj.loaded = true;
        }
      } else {
        let apiKey = updateObj[key]['api-key'];
        let userId = this.state.userId;
        if (apiKey && userId) {
          InstagramPhotosActions.getPhotos('user', userId, apiKey);
        }
      }

      this.setState(updateObj);
    }
  },

  _toDisplayImage(image, index) {
    return (
      <ImageBlock
        className="1111"
        key={image.id}
        index={index}
        image={image}
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

  _enableInfiniteLoading() {
    this.setState({
      isInfiniteLoadingEnabled: true
    });
  },

  _loadMoreItems() {
    this.setState({
      isInfiniteLoading: true
    });

    let {pagination} = this.state.photosData.photos;
    InstagramPhotosActions.getMorePhotos(pagination.next_url);
  },

  _renderWaypoint() {
    let {state} = this;
    let {photosData} = state;

    if (!state.isInfiniteLoadingEnabled) {
      return (
        <div
          className="load-more"
        >
          <span
            className="load-more__button"
            onClick={this._enableInfiniteLoading}
          >
            Load more
          </span>
        </div>
      );
    } else if (photosData.hasMorePhotos === false) {
      // do nothing if we have nothing to show
      return true;
    } else if (state.isInfiniteLoading) {
      return (
        <p className="infinite-scroll-example__loading-message">
          Loading...
        </p>
      );
    } else {
      return (
        <Waypoint
          onEnter={this._loadMoreItems}
          threshold={0.2}
        />
      );
    }
  },

  render() {
    let {photosData, loaded} = this.state;
    let {data} = photosData.photos;
    let {error} = photosData;

    let classNames = 'app app-bg user-photos-screen';
    let user = this._getUserBlock();

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
            {this._renderWaypoint()}
          </div>
        </div>
      );
    }
  }
});

export default MachineUserPhotos;
