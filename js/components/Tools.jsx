import React from 'react';
import AltContainer from 'alt/AltContainer';
import ToolsActions from '../actions/LocationActions';

var Tools = React.createClass({
  render() {
    return (
      <div>
        <main class="mdl-layout__content">
          <div class="demo-blog__posts mdl-grid">
            <h1>Tools</h1>
          </div>
        </main>
        <div class="mdl-layout__obfuscator"></div>
      </div>
    );
  }
});

export default Tools