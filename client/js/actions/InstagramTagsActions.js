import dispatcher from '../dispatcher/appDispatcher.js';
import InstagramSource from '../sources/InstagramSource.js';

class InstagramTagsActions {
  // this way! go to server here and dispatch all staff here!
  searchTags(query, apiKey) {
    let request = InstagramSource.searchTags(query, apiKey);
    request
      .then((response) => this.actions.updateTags(response.data))
      .catch((response) =>  this.actions.instagramFailed(response.statusText));
  }

  updateTags(tagsResponse) {
    let { data } = tagsResponse;
    this.dispatch(data);
  }

  instagramFailed(errorData) {
    this.dispatch(errorData);
  }

}

export default dispatcher.createActions(InstagramTagsActions);
