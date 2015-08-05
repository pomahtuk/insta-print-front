import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserPhotosStore from '../stores/InstagramUserPhotosStore';
import InstagramUserStore from '../stores/InstagramUserStore';
import InstagramUserPhotosActions from '../actions/InstagramUserPhotosActions';
import Router from 'react-router';

import UserBlock from '../components/Machine/UserBlock.jsx';

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
      userPhotos: {}
    };
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange.bind(this, 'settings', SettingsStore));
    InstagramUserPhotosStore.listen(this._onChange.bind(this, 'userPhotos', InstagramUserPhotosStore));

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
    InstagramUserPhotosStore.unlisten(this._onChange.bind(this, 'userPhotos', InstagramUserPhotosStore));
    InstagramUserPhotosActions.clearUserPhotos();
  },

  /* Store events */
  _onChange(key, store) {
    if (this.isMounted()) {
      let updateObj = {};
      updateObj[key] = store.getData();

      if (key === 'userPhotos') {
        if (updateObj[key] && updateObj[key].data) {
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

  _addToCart(userImage) {
    InstagramUserPhotosActions.addToCart(userImage);
  },

  _removeFromCart(userImage) {
    InstagramUserPhotosActions.removeFromCart(userImage);
  },

  _toDisplayImage(userImage, index) {
    let {standard_resolution, high_resolution} = userImage.images,
      workImage = high_resolution || standard_resolution,
      colCount = 3,
      paddingValue = 5,
      colItemWidth = ((window.innerWidth * 0.7) - paddingValue * (colCount - 1)) / colCount;

    let containerClassNames = classnames({
      'single-image__container': true,
      'single-image__container--cart': userImage.addedToCart,
      'single-image__container--first': index % colCount === 0,
      'single-image__container--last': index % colCount === colCount
    });

    function addOverlay() {
      if (userImage.addedToCart) {
        return (
          <div className="single-image__actions">
            in cart: {userImage.countAdded}
            <br/>
            <button onClick={this._addToCart.bind(this, userImage)}>add to cart</button>
            <button onClick={this._removeFromCart.bind(this, userImage)}>remove from cart</button>
          </div>
        );
      }
    }

    return (
      <div className={containerClassNames} key={userImage.id}>
        <img
          className="single-image__image"
          src={`${userImage.link}media/?size=l`}
          width={colItemWidth}
          height={colItemWidth}
          onClick={this._addToCart.bind(this, userImage)}
        />
        {addOverlay.call(this)}
      </div>
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
    let {userPhotos, loaded} = this.state;
    let {data} = userPhotos;

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
    } else {
      return (
        <div className={classNames}>
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
