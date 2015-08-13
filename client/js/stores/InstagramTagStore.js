import dispatcher from '../dispatcher/appDispatcher';
import InstagramTagsActions from  '../actions/InstagramTagsActions';

class InstagramTagStore {
  constructor() {
    this.tags = [];

    this.bindListeners({
      handleUpdateTags: InstagramTagsActions.UPDATE_TAGS
    });

    this.exportPublicMethods({
      getData: this.getData,
      getTag: this.getTag
    });

  }

  getData() {
    let {tags} = this.getState();
    return tags;
  }

  getTag(tagName) {
    let {tags} = this.getState();
    let tagArr = tags.filter((tag) => {
      return tag.id === tagName;
    });
    return tagArr[0];
  }

  handleUpdateTags(tags) {
    this.tags = tags;
  }

}

export default dispatcher.createStore(InstagramTagStore, 'InstagramTagStore');
