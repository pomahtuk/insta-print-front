import SettingsActions from '../../actions/SettingsActions';
import SettingsStore from '../../stores/SettingsStore';
import React from "react/addons";

let ToolsButtons = React.createClass({
  // some state has to be initial
  getInitialState () {
    return {
      settings: {}
    }
  },

  // once parrent container receive state updates
  // we will be able to reflect this
  componentWillReceiveProps(nextProps) {
    let {settings} = nextProps;

    this.setState({
      settings: settings
    });
  },

  // just mock method
  _updateSettings (key) {
    console.log(key);
  },

  // we need to update state value on input change
  _handleInputChange (key) {
    let updateObject = {};
    updateObject[key] = event.target.value;
    this.setState({
      settings: updateObject
    });
  },

  // two way databinding implementation
  _getCurrentOption (key) {
    var optionValue = SettingsStore.getOption(key);
    console.log(optionValue);
  },

  render () {
    let {settings} = this.state;
    let inputs = [];

    // creating inputs for each settings key
    for (let key in settings) {
      if (settings.hasOwnProperty(key)) {
        inputs.push(
          <div className="input-container" key={key}>
            <input type="text" value={settings[key]} onChange={this._handleInputChange.bind(this, key)} />
            <button onClick={this._updateSettings.bind(this, key)}>Update</button>
            <button onClick={this._getCurrentOption.bind(this, key)}>Get</button>
          </div>
        )
      }
    }

    // once we have settings available - render
    return (
      <div>
        <div className="input-container">
          { inputs }
        </div>
      </div>
    );

  }
});

export default ToolsButtons;
