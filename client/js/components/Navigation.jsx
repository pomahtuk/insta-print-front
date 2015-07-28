import React from 'react/addons';
import { Link } from 'react-router';

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

export default Navigation;
