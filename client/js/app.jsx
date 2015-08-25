import React from 'react';
import Router, { DefaultRoute, Link, Route } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Tools from './components/Tools.jsx';
import Machine from './components/Machine.jsx';
import EmptyView from './components/EmptyView.jsx';
import StatusBarEmptyView from './components/StatusBarEmptyView.jsx';
import MachineSearch from './components/MachineSearch.jsx';
import MachinePhotos from './components/MachinePhotos.jsx';

import MachineOrder from './components/MachineOrder.jsx';

import WalletActions from './actions/WalletActions';

let routes = (
  <Route handler={EmptyView}>
    <Route path="/tools" handler={EmptyView}>
      <DefaultRoute name="tools" handler={Tools} />
    </Route>

    <Route path="/search" handler={EmptyView}>
      <Route name="photos" path=":type" handler={MachinePhotos} />

      <DefaultRoute name="search" handler={MachineSearch} />
    </Route>

    <Route path="/order" handler={EmptyView}>

      <DefaultRoute name="order" handler={MachineOrder} />
    </Route>

    <DefaultRoute name="index" handler={Machine} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  WalletActions.openSocket();
  React.render(<Handler/>, document.getElementById('react'));
});
