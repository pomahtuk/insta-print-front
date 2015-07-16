// js for material design - really doubt we will need this, but still
import mdl from 'material-design-lite/material.js';

import React from 'react';
import Router, { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Locations from './components/Locations.jsx';
import Tools from './components/Tools.jsx';

let App = React.createClass({
  render() {
    return (
      <div class="demo-blog mdl-layout mdl-js-layout has-drawer is-upgraded">
        <Link to="index">Home</Link>
        <Link to="locations">Locations</Link>
        <Link to="tools">Tools</Link>
        {/* this is the importTant part */}
        <RouteHandler/>
      </div>
    );
  }
});

let routes = (
  <Route name="index" path="/" handler={App}>
    <Route name="locations" path="/locations" handler={Locations}/>
    <Route name="tools" path="/tools" handler={Tools}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});