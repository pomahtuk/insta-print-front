import InstagramActions from '../../actions/InstagramActions';
import React from 'react/addons';

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

  _toLocationItem (location) {
    return (
      <div
        key={location.id}
        onMouseEnter={this._setLocationHover.bind(this, location, true)}
        onMouseLeave={this._setLocationHover.bind(this, location, false)}
      >
        <p>
          {location.name} -  {location.hovered ? 'true' : 'false'}
        </p>

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
        className="main-sidebar"
      >
        {locations.map(this._toLocationItem, this)}
      </div>
    );
  }
});

export default MapLocationsList;
