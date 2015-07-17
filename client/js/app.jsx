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
      </nav>
    )
  }
}

let App = React.createClass({
  mixins: [State],

  drawConditionalNavigation (routeLink) {
    if (routeLink === '/') {
      return true;
    }

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

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});
