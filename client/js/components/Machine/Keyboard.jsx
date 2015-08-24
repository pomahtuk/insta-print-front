import React from 'react';

import classnames from 'classnames';

let Keyboard = React.createClass({
  getInitialState() {
    return {
      shiftKey: false,
      capsLockKey: false,
      resultingOutput: this.props.parentValue,
      symbolsUpperRow: [
        ['`', '~'],
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+']
      ],
      lettersFirstRow: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      symbolsFirstRow: [
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      lettersSecondRow: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      symbolsSecondRow: [
        [';', ':'],
        ['\'', '"']
      ],
      lettersThirdRow: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
      symbolsThirdRow: [
        [',', '<'],
        ['.', '>'],
        ['/', '?']
      ]
    };
  },

  _toSymbolKey(symbol, index) {
    let uppercase = this.state.shiftKey || this.state.capsLockKey;
    let drawSymbol = uppercase ? symbol[1] : symbol[0];
    return (
      <li className="symbol" key={index}>
        <span onClick={this._handleKey.bind(this, drawSymbol)}>{drawSymbol}</span>
      </li>
    );
  },

  _toLetterKey(letter, index) {
    let uppercase = this.state.shiftKey || this.state.capsLockKey;
    let classNames = classnames({
      'letter': true,
      'uppercase': uppercase
    });
    let drawLetter = uppercase ? letter.toUpperCase() : letter;
    return (
      <li className={classNames} key={index} onClick={this._handleKey.bind(this, drawLetter)}>{drawLetter}</li>
    );
  },

  _handleKey(key) {
    let {resultingOutput} = this.state;
    let {onChange} = this.props;

    switch (key) {
      case 'shift':
        let shiftState = this.state.shiftKey;
        this.setState({
          shiftKey: !shiftState,
          capsLockKey: false
        });
        break;
      case 'capsLock':
        let capsState = this.state.capsLockKey;
        this.setState({
          capsLockKey: !capsState,
          shiftKey: false
        });
        break;
      case 'delete':
        resultingOutput = resultingOutput.slice(0, -1);
        this.setState({
          resultingOutput: resultingOutput,
          shiftKey: false
        });
        break;
      case 'tab':
      case 'return':
        break;
      default:
        resultingOutput += key;
        this.setState({
          resultingOutput: resultingOutput,
          shiftKey: false
        });
    }

    onChange(resultingOutput);

  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      resultingOutput: nextProps.parentValue
    });
  },

  render() {
    let {
      symbolsUpperRow,
      symbolsFirstRow,
      lettersFirstRow,
      lettersSecondRow,
      symbolsSecondRow,
      lettersThirdRow,
      symbolsThirdRow,
      resultingOutput
    } = this.state;

    console.log(resultingOutput);

    return (
      <ul id="keyboard">
        {symbolsUpperRow.map(this._toSymbolKey, this)}
        <li className="delete lastitem" onClick={this._handleKey.bind(this, 'delete')}>delete</li>
        <li className="tab" onClick={this._handleKey.bind(this, 'tab')}>tab</li>
        {lettersFirstRow.map(this._toLetterKey, this)}
        {symbolsFirstRow.map(this._toSymbolKey, this)}
        <li className="capslock" onClick={this._handleKey.bind(this, 'capsLock')}>caps lock</li>
        {lettersSecondRow.map(this._toLetterKey, this)}
        {symbolsSecondRow.map(this._toSymbolKey, this)}
        <li className="return lastitem" onClick={this._handleKey.bind(this, 'return')}>
          <i className="material-icons">search</i>
        </li>
        <li className="left-shift" onClick={this._handleKey.bind(this, 'shift')}>shift</li>
        {lettersThirdRow.map(this._toLetterKey, this)}
        {symbolsThirdRow.map(this._toSymbolKey, this)}
        <li className="right-shift lastitem" onClick={this._handleKey.bind(this, 'shift')}>shift</li>
        <li className="space lastitem" onClick={this._handleKey.bind(this, ' ')}>space</li>
      </ul>
    );
  }
});

export default Keyboard;
