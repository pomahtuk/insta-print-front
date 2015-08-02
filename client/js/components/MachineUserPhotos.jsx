import React from 'react';

import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';
import InstagramStore from '../stores/InstagramStore';
import InstagramActions from '../actions/InstagramActions';
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

  _addToCart(userImage) {
    InstagramActions.addToCart(userImage);
  },

  _removeFromCart(userImage) {
    InstagramActions.removeFromCart(userImage);
  },

  _toDisplayImage(userImage, index) {
    let {standard_resolution, high_resolution} = userImage.images,
      workImage = high_resolution || standard_resolution,
      colCount = 4,
      colItemWidth = window.innerWidth / colCount;

    let classNames = classnames({
      'main-screen-photos__image-container': true,
      'main-screen-photos__image-container--cart': userImage.addedToCart
    });

    return (
      <div className={classNames} key={userImage.id}>
        <img
          className='main-screen-photos__image'
          src={`${userImage.link}media/?size=l`}
          width={colItemWidth}
          height={colItemWidth}
        />
        <div className="main-screen-photos__image-actions">
          <button onClick={this._addToCart.bind(this, userImage)}>add to cart</button>
          <button onClick={this._removeFromCart.bind(this, userImage)}>remove from cart</button>
        </div>
      </div>
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
          <div>
            {data.map(this._toDisplayImage, this)}
          </div>
        </div>
      );
    }
  }
});

export default MachineUserPhotos;
