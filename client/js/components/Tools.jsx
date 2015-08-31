import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

import React from 'react/addons';
import Router from 'react-router';

import ToolsMap from './Tools/ToolsMap.jsx';

import { AppBar, LeftNav, IconButton } from 'material-ui';
import {THEME_MANAGER, MENU_ITEMS} from '../constants/App';

let Tools = React.createClass({
  mixins: [ Router.State ],

  getInitialState() {
    return {
      menuOpened: false
    };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: THEME_MANAGER.getCurrentTheme()
    };
  },

  componentDidMount() {
    // handle instagram auth token
    const {router} = this.context;
    let token = window.location.hash.split('=')[1];

    if (token && token !== this.state.settings['api-key']) {
      SettingsActions.updateSettingsValue({
        key: 'api-key',
        value: token
      });
    }
  },

  _NavClosed() {
    this.setState({
      menuOpened: false
    });
  },

  _NavOpened() {
    this.setState({
      menuOpened: true
    });
  },

  _toggleMenuState() {
    this.refs.leftNav.toggle();
  },

  _onLeftNavChange(e, key, payload) {
    // Do DOM Diff refresh
    this.context.router.transitionTo(payload.route);
  },

  render() {
    let { menuOpened } = this.state;

    return (
      <div>

        <AppBar
          title="PrintBox"
          iconElementLeft={menuOpened ?
            <IconButton onClick={this._toggleMenuState} iconClassName="material-icons">close</IconButton> :
            <IconButton onClick={this._toggleMenuState} iconClassName="material-icons">menu</IconButton>
          }
        />

        <LeftNav
          ref="leftNav"
          docked={false}
          onNavClose={this._NavClosed}
          onNavOpen={this._NavOpened}
          onChange={this._onLeftNavChange}
          selectedIndex={1}
          menuItems={MENU_ITEMS}
        />

      </div>
    );
  }
});

export default Tools;
