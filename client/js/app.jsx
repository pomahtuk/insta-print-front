import React from 'react';
import Router, { State, DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Tools from './components/Tools.jsx';
import Machine from './components/Machine.jsx';

let clientId = '0e746470835249b0a01487361b63d20d';
let redirectUri = 'http://localhost:3000/tools';
let instaLink = `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

class Navigation extends React.Component {
  render() {
    return (
      <ul className="navigation">
        <li><Link to="index">Home</Link></li>
        <li><Link to="tools">Tools</Link></li>
        <li><a href={instaLink}>Instagramm Auth</a></li>
      </ul>
    );
  }
}

let App = React.createClass({
  mixins: [State],

  render() {
    return (
      <div className="app">

        <Navigation />

        <div className="app-content">
          <RouteHandler/>
        </div>

      </div>
    );
  }
});

let routes = (
  <Route handler={App}>
    <Route name="tools" path="/tools" handler={Tools}/>
    <DefaultRoute name="index" handler={Machine} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});
