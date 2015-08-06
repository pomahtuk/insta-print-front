import React from 'react';
import { RouteHandler } from 'react-router';
import StatusBarContainer from './StatusBar/StatusBarContainer.jsx';

class StatusBarEmptyView extends React.Component {
  render() {
    return (
      <div className="11">
        <StatusBarContainer/>
        <RouteHandler/>
      </div>
    );
  }
}

export default StatusBarEmptyView;
