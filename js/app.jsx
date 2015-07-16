// js for material design - really doubt we will need this, but still
import mdl from 'material-design-lite/material.js';

import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Locations from './components/Locations.jsx';

// let App = React.createClass({
//   render() {
//     return (
//       <div className="nav">
//         <Link to="app">Home</Link>
//         <Link to="login">Login</Link>

//         {/* this is the importTant part */}
//         <RouteHandler/>
//       </div>
//     );
//   }
// });

let routes = (
  <Route name="index" path="/" handler={Locations}>
    <Route name="locations" path="/locations" handler={Locations}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});


// React.render(
//   <Locations />,
//   document.body
// );
