import React from 'react/addons';
import { Link } from 'react-router';
import { CLIENT_ID, REDIRECT_URI } from '../constants/App';

let instaLink = `https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token`;

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

export default Navigation;
