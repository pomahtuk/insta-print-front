// js for material design - really doubt we will need this, but still
import mdl from 'material-design-lite/material.js';

import React from 'react';
import Router, { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Locations from './components/Locations.jsx';
import Tools from './components/Tools.jsx';

let Navigation = React.createClass({
  render() {
    return (
      <nav className="mdl-navigation">
        <Link to="index" className="mdl-navigation__link">Home</Link>
        <Link to="locations" className="mdl-navigation__link">Locations</Link>
        <Link to="tools" className="mdl-navigation__link">Tools</Link>
      </nav>
    )
  }
});

let App = React.createClass({
  render() {
    return (
      <div className="layout-transparent mdl-layout mdl-js-layout">

        <header classNane="mdl-layout__header mdl-layout__header--transparent">
          <div classNane="mdl-layout__header-row">
            <Navigation/>
          </div>
        </header>
        
        <div classNane="mdl-layout__drawer">
          <Navigation/>
        </div>

        <main classNane="mdl-layout__content">
          <RouteHandler/>
        </main>

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
  React.render(<Handler/>, document.getElementById('react'));
});