import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

import React from "react/addons";
import Router from 'react-router';

import ToolsButtons from './Tools/ToolsButtons.jsx';
import ToolsMap from './Tools/ToolsMap.jsx';

let Tools = React.createClass({
  mixins: [ Router.State ],

  getInitialState() {
    return {
      settings: {}
    }
  },

  componentDidMount() {
    SettingsStore.listen(this._onChange);
    SettingsActions.fetchSettings();

    // handle instagram auth token
    const {router} = this.context;
    let queryObjext = router.getCurrentQuery();
    if (queryObjext.code) {
      SettingsActions.updateSettingsValue({
        key: 'api-key',
        value: queryObjext.code
      });
    }
  },

  componentWillUnmount() {
    SettingsStore.unlisten(this._onChange);
  },

  /* Store events */
  _onChange() {
    this.setState({
      settings: SettingsStore.getSettings()
    });
  },

  render() {
    return (
      <div>
        <ToolsButtons settings={this.state.settings} />
        <ToolsMap settings={this.state.settings} />
      </div>
    );
  }
});

export default Tools;
