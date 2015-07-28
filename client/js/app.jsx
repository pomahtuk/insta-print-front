import React from 'react';
import Router, { DefaultRoute, Link, Route } from 'react-router';

import Tools from './components/Tools.jsx';
import Machine from './components/Machine.jsx';
import EmptyView from './components/EmptyView.jsx';

let routes = (
  <Route handler={EmptyView}>
    <Route name="tools" path="/tools" handler={Tools} />

    <DefaultRoute name="index" handler={Machine} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('react'));
});
