import React from 'react';
import { Link } from 'react-router';

class UserBlock extends React.Component {
  render() {
    let {user, linkParams, linkTo} = this.props;

    return (
      <Link to={linkTo} params={linkParams} className="found-user">
        <img className="found-user__image" src={user.profile_picture} />
        <br/>
        <span>
          @{user.username} - {user.full_name}
        </span>
      </Link>
    );
  }
}

export default UserBlock;
