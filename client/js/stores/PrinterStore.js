import dispatcher from '../dispatcher/appDispatcher';
import PrinterActions from  '../actions/PrinterActions';

class PrinterStore {
  constructor() {
    this.data = {};
    this.error = null;

    this.bindListeners({
      handlePrintingDone: PrinterActions.PRINTING_DONE,
      handlePrintingError: PrinterActions.PRINTING_ERROR
    });

    this.exportPublicMethods({
      getData: this.getData
    });
  }

  getData() {
    let data = this.getState();
    return data;
  }

  handlePrintingDone(data) {
    this.data = data;
  }

  handlePrintingError(errorMessage) {
    this.error = errorMessage;
  }

}

export default dispatcher.createStore(PrinterStore, 'PrinterStore');
