import dispatcher from '../dispatcher/appDispatcher';
import InstagramUserActions from  '../actions/InstagramUserActions';

class InstagramUserStore {
  constructor() {
    this.users = [];

    this.bindListeners({
      handleUpdateUsers: InstagramUserActions.UPDATE_USERS
    });

    this.exportPublicMethods({
      getData: this.getData
    });

  }

  getData() {
    let {users} = this.getState();
    return users;
  }

  handleUpdateUsers(users) {
    this.users = users;
  }

}

export default dispatcher.createStore(InstagramUserStore, 'InstagramUserStore');
