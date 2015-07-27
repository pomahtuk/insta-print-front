import InstagramActions from '../../actions/InstagramActions';
import React from 'react/addons';
import classNames from 'classnames';

let MapLocationsList = React.createClass({
  getInitialState () {
    return this.props;
  },

  // once parrent container receive state updates
  // we will be able to reflect this
  componentWillReceiveProps(nextProps) {
    let {locations} = nextProps;

    if (locations) {
      this.setState({
        locations: locations
      });
    }

  },

  _toLocationItem (location, index) {
    let classes = classNames({
      'location-options__item': true,
      'location-options__item--hover': location.hovered,
      'location-options__item--current': location.current
    });

    let title = `${index+1} : ${location.name}`;

    return (
      <div
        className={classes}
        key={location.id}
        onMouseEnter={this._setLocationHover.bind(this, location, true)}
        onMouseLeave={this._setLocationHover.bind(this, location, false)}
      >
        <div className='location-options__item__title'>
          {title}
        </div>

        <button className="pure-button pure-button-primary" href="#">Set as machine location</button>
      </div>
    );
  },

  _setLocationHover (location, state) {
    InstagramActions.setLocationHoverState(location.id, state);
  },

  render () {
    let {locations} = this.state;

    return (
      <div
        className="main-sidebar location-options"
      >
        <div className='location-options__container'>
          {locations.map(this._toLocationItem, this)}
        </div>
      </div>
    );
  }
});

export default MapLocationsList;
