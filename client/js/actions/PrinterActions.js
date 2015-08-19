import dispatcher from '../dispatcher/appDispatcher.js';
import PrintingSource from '../sources/PrintingSource.js';

class PrinterActions {
  printImages(images) {
    let request = PrintingSource.printCartImages(images);
    request
      .then((response) => this.actions.printingDone(response.data))
      .catch((response) =>  this.actions.printingError(response.statusText));
  }

  printingDone(data) {
    this.dispatch(data);
  }

  printingError(errorMessage) {
    this.dispatch(errorMessage);
  }
}

export default dispatcher.createActions(PrinterActions);
