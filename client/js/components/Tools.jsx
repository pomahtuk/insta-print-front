import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

import React from 'react/addons';
import Router from 'react-router';

import ToolsMap from './Tools/ToolsMap.jsx';

import { AppBar, LeftNav, IconButton, Paper, Toggle, DropDownMenu } from 'material-ui';
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
    let menuItems = [
       { payload: '1', text: 'Never' },
       { payload: '2', text: 'Every Night' },
       { payload: '3', text: 'Weeknights' },
       { payload: '4', text: 'Weekends' },
       { payload: '5', text: 'Weekly' }
    ];

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

        <div className="app-holder">

          <Paper zDepth={1}>
            <div className="paper-container-items">
              <div className="paper-container-items--sub">
                <h2> Base modes </h2>

                <Toggle
                  name="toggleName1"
                  value="toggleValue1"
                  label="Demo mode"
                  defaultToggled={false}
                />

                <Toggle
                  name="toggleName2"
                  value="toggleValue2"
                  label="Hash tag mode"
                  defaultToggled={false}
                />

                <Toggle
                  name="toggleName3"
                  value="toggleValue3"
                  label="Use pre-set location"
                  defaultToggled={false}
                />
              </div>
            </div>
          </Paper>

          <Paper zDepth={1}>
            <div className="paper-container-items">
              <div className="paper-container-items--sub">
                <h2> Printer select </h2>
                <DropDownMenu menuItems={menuItems} />
              </div>
            </div>
          </Paper>

        </div>
      </div>
    );
  }
});

export default Tools;
