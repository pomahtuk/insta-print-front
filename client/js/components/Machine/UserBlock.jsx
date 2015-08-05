import React from 'react';
import { Link } from 'react-router';

class UserBlock extends React.Component {
  render() {
    let {user, linkParams, linkTo} = this.props;

    return (
      <Link to={linkTo} params={linkParams} className="found-user">
        <img className="found-user__image" src={user.profile_picture} />
        <div className="found-user__user-data-container">
          <span className="found-user__user-data">
            <div className="found-user__username">{user.username}</div>
            <div className="found-user__fullname">{user.full_name}</div>
          </span>
        </div>
      </Link>
    );
  }
}

export default UserBlock;
