import dispatcher from '../dispatcher/appDispatcher';
import InstagramUserActions from  '../actions/InstagramUserActions';

class InstagramUserStore {
  constructor() {
    this.users = [];

    this.bindListeners({
      handleUpdateUsers: InstagramUserActions.UPDATE_USERS
    });

    this.exportPublicMethods({
      getData: this.getData,
      getUser: this.getUser
    });

  }

  getData() {
    let {users} = this.getState();
    return users;
  }

  getUser(userId) {
    let {users} = this.getState();
    let userArr = users.filter((user) => {
      return user.id === userId;
    });
    return userArr[0];
  }

  handleUpdateUsers(users) {
    this.users = users;
  }

}

export default dispatcher.createStore(InstagramUserStore, 'InstagramUserStore');
