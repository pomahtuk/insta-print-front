import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramUserActions {
  // this way! go to server here and dispatch all staff here!
  searchUsers(query, apiKey) {
    let request = InstagramSource.searchUsers(query, apiKey);
    request
      .then((response) => this.actions.updateUsers(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  updateUsers(usersResponse) {
    let { data } = usersResponse;
    this.dispatch(data);
  }

}

export default dispatcher.createActions(InstagramUserActions);
