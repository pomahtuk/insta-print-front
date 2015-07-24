import React from 'react';
import Router, { State, DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import Locations from './components/Locations.jsx';
import Tools from './components/Tools.jsx';

class Navigation extends React.Component {
  render() {
    return (
      <nav className="mdl-navigation">
        <Link to="index" className="mdl-navigation__link">Home</Link>
        <Link to="locations" className="mdl-navigation__link">Locations</Link>
        <Link to="tools" className="mdl-navigation__link">Tools</Link>
        <a href="https://api.instagram.com/oauth/authorize/?client_id=0e746470835249b0a01487361b63d20d&redirect_uri=http://localhost:3000/tools&response_type=token">Instagramm Auth</a>
      </nav>
    )
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
      <header classNane="">
        <div classNane="">
          <Navigation />
        </div>
      </header>
    )
  },

  render() {
    var link = this.getPath();

    return (
      <div className="">

        {this.drawConditionalNavigation(link)}

        <main classNane="">
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

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});
