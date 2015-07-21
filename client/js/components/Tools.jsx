import AltContainer from 'alt/AltContainer';
import SettingsActions from '../actions/SettingsActions';
import SettingsStore from '../stores/SettingsStore';

import React from "react/addons";
import Router from 'react-router';

import ToolsButtons from './Tools/ToolsButtons.jsx';
import ToolsMap from './Tools/ToolsMap.jsx';

let ToolsContainer = React.createClass({
  mixins: [ Router.State ],

  render() {
    const {props, state} = this;
    const {router} = this.context;

    let queryObjext = router.getCurrentQuery();

    if (queryObjext.code) {
      // update value based on instagramm api response
      SettingsActions.updateSettingsValue({
        key: 'api-key',
        value: queryObjext.code
      });
      // clear querystring?
    }

    // show spinner while getting response from server
    if (SettingsStore.isLoading()) {
      return (
        <div>
          <img src="images/ajax-loader.gif" />
        </div>
      )
    }

    return (
      <div>
        <ToolsButtons settings={this.props.settings} />
        <ToolsMap settings={this.props.settings} />
      </div>
    );
  }
});

class Tools extends React.Component {
  componentDidMount() {
    SettingsStore.fetchSettings();
  }

  render() {
    return (
      <AltContainer store={SettingsStore}>
        {/*<ToolsButtons />
        <ToolsMap />*/}
        <ToolsContainer/>
      </AltContainer>
    );
  }
};

export default Tools;
