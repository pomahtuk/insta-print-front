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
    const {router} = this.context;

    let queryObjext = router.getCurrentQuery();

    // if (queryObjext.code) {
    //   // check for progress actions
    //   // update value based on instagramm api response
    //   SettingsActions.updateSettingsValue({
    //     key: 'api-key',
    //     value: queryObjext.code
    //   });
    //   // clear querystring?

    return (
      <div>
        <ToolsButtons settings={this.state.settings} />
        <ToolsMap settings={this.state.settings} />
      </div>
    );
  }
});

export default Tools;
