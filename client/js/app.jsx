import React from 'react';
import Router, { DefaultRoute, Link, Route } from 'react-router';

import Tools from './components/Tools.jsx';
import Machine from './components/Machine.jsx';
import EmptyView from './components/EmptyView.jsx';
import StatusBarEmptyView from './components/StatusBarEmptyView.jsx';
import MachineUsers from './components/MachineUsers.jsx';
import MachinePhotos from './components/MachinePhotos.jsx';

import MachineOrder from './components/MachineOrder.jsx';

import WalletActions from './actions/WalletActions';

let routes = (
  <Route handler={EmptyView}>
    <Route name="tools" path="/tools" handler={Tools} />

    <Route path="/users" handler={StatusBarEmptyView}>
      <Route name="userPhotos" path=":userId" handler={MachinePhotos} />

      <DefaultRoute name="users" handler={MachineUsers} />
    </Route>

    <Route path="/order" handler={StatusBarEmptyView}>


      <DefaultRoute name="order" handler={MachineOrder} />
    </Route>

    <DefaultRoute name="index" handler={Machine} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  WalletActions.openSocket();
  React.render(<Handler/>, document.getElementById('react'));
});
