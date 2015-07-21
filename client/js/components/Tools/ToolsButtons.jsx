import SettingsActions from '../../actions/SettingsActions';
import SettingsStore from '../../stores/SettingsStore';
import React from "react/addons";

let ToolsButtons = React.createClass({

  // some state has to be initial
  getInitialState () {
    return {};
  },

  // this will be on update of each Flux store
  componentWillReceiveProps(nextProps) {
    let settings = nextProps.settings;
    let newStateObj = {};

    // this needed to let input work
    settings.map((option) => newStateObj[option.key] = option.value);

    this.setState(newStateObj);
  },

  // just mock method
  _updateSettings (option) {
    console.log(option.key);
  },

  // we need to update state value on input change
  _handleInputChange (option) {
    let updateObject = {};
    updateObject[option.key] = event.target.value;
    this.setState(updateObject);
  },

  render () {
    // once we have settings available - render
    return (
      <div>
        <div className="input-container">
          { /* mapping all settings to coresponding input component representation*/ }
          {this.props.settings.map((option, index) => toInputs.call(this, option, index))}
        </div>
      </div>
    );

    // function which renders input groups
    function toInputs(option, index) {
      return (
        <div className="input-container">
          <input type="text" dafaultValue={option.value} value={this.state[option.key]} htmlFor={option.key} onChange={this._handleInputChange.bind(this, option)} />
          <button onClick={this._updateSettings.bind(this, option)}>Update</button>
        </div>
      )
    }

  }
});

export default ToolsButtons;
