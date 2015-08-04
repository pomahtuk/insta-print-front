import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramUserPhotosStore from '../stores/InstagramUserPhotosStore';
import InstagramUserPhotosActions from '../actions/InstagramUserPhotosActions';
import Router from 'react-router';

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
      colItemWidth = (window.innerWidth * 0.7) / colCount;

    let containerClassNames = classnames({
      'single-image__container': true,
      'single-image__container--cart': userImage.addedToCart
    });

    return (
      <div className={containerClassNames} key={userImage.id}>
        <img
          className="single-image__image"
          src={`${userImage.link}media/?size=l`}
          width={colItemWidth}
          height={colItemWidth}
        />
        <div className="single-image__actions">
          in cart: {userImage.countAdded}
          <button onClick={this._addToCart.bind(this, userImage)}>add to cart</button>
          <button onClick={this._removeFromCart.bind(this, userImage)}>remove from cart</button>
        </div>
      </div>
    );
  },

  render() {
    let {userPhotos, loaded} = this.state;
    let {data} = userPhotos;

    let classNames = 'app app-bg user-photos-screen';

    if (!loaded) {
      return (
        <div className={classNames}>
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
          <div className="user-photos-screen__images-container">
            {data.map(this._toDisplayImage, this)}
          </div>
        </div>
      );
    }
  }
});

export default MachineUserPhotos;
