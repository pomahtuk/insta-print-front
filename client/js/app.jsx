import React from 'react';
import Router, { State, DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Locations from './components/Locations.jsx';
import Tools from './components/Tools.jsx';

let clientId = '0e746470835249b0a01487361b63d20d';
let redirectUri = 'http://localhost:3000/tools';
let instaLink = `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

class Navigation extends React.Component {
  render() {
    return (
      <ul className="navigation">
        <li><Link to="index">Home</Link></li>
        <li><Link to="locations">Locations</Link></li>
        <li><Link to="tools">Tools</Link></li>
        <li><a href={instaLink}>Instagramm Auth</a></li>
      </ul>
    );
  }
}

// instagramm apiKey = 3b1454dc18344ec19d4344c25efe2c18

let App = React.createClass({
  mixins: [State],

  drawConditionalNavigation (routeLink) {
    // if (routeLink === '/') {
    //   return true;
    // }

    return (
      <header className="">
        <Navigation />
      </header>
    );
  },

  render() {
    var link = this.getPath();

    return (
      <div className="app">

        {this.drawConditionalNavigation(link)}

        <div className="app-content">
          <RouteHandler/>
        </div>

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

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});
