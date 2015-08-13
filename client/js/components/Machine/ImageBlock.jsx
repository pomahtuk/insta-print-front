import React from 'react';

import InstagramUserPhotosActions from '../../actions/InstagramUserPhotosActions';

import { Link } from 'react-router';
import classnames from 'classnames';

let ImageBlock = React.createClass({
  _addToCart(userImage) {
    InstagramUserPhotosActions.addToCart(userImage);
  },

  _removeFromCart(userImage) {
    InstagramUserPhotosActions.removeFromCart(userImage);
  },

  render() {
    let {index, userImage, colCount, paddingValue} = this.props,
      // 15 is hardcoded for browser scrollbar size
      colItemWidth = (((window.innerWidth - 15) * 0.75) - paddingValue * (colCount - 1)) / colCount;

    let containerClassNames = classnames({
      'single-image__container': true,
      'single-image__container--first': index % colCount === 0,
      'single-image__container--last': index % colCount === colCount,
      'single-image__container--cart': userImage.addedToCart
    });

    let imageClassNames = classnames({
      'single-image__image': true,
      'single-image__image--blur': userImage.addedToCart
    });

    function addOverlay() {
      if (userImage.addedToCart) {
        return (
          <div className="single-image__actions">
            <div className="single-image__actions-container">
              <button className="single-image__actions-remove" onClick={this._removeFromCart.bind(this, userImage)}>
                <i className="material-icons">exposure_neg_1</i>
              </button>
              <div className="single-image__actions-amount">
                {userImage.countAdded}
              </div>
              <button className="single-image__actions-add" onClick={this._addToCart.bind(this, userImage)}>
                <i className="material-icons">exposure_plus_1</i>
              </button>
            </div>
            <div className="single-image__actions-oder">
              <i className="material-icons">print</i>
              <Link to="order" className="single-image__actions-oder-description">Print order</Link>
            </div>
          </div>
        );
      }
    }

    return (
      <div
        className={containerClassNames}
      >
        <img
          className={imageClassNames}
          src={userImage.preloaded ? userImage.imageLink : ''}
          width={colItemWidth}
          height={colItemWidth}
          onClick={this._addToCart.bind(this, userImage)}
        />
        {addOverlay.call(this)}
      </div>
    );
  }
});

export default ImageBlock;