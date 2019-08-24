const queueCounter = document.getElementById('add-books-counter');

class AddBooksModal {

  static init = () => {
    AddBooksModal.bindEventListeners()
  }


  static bindEventListeners = () => {
    document.getElementById('queue-book-button').addEventListener('click',(e) => {
      AddBooksModal.queueBook(e);
    })
    document.getElementById('close-addBooksModal').addEventListener('click',() => {
      AddBooksModal.clearQueuedBooks();
    })
    document.getElementById('add-books-button').addEventListener('click',() => {
      Library.addBooks();
    })
    document.addEventListener('click', AddBooksModal.captureCloseModal);
    window.onbeforeunload = () => AddBooksModal.clearQueuedBooks();
  }


  static queueBook = async (e) => {
    e.preventDefault();
    try {
      var addNewBookObj = {};
      for (var i = 0; i < event.target.form.length - 2; i++) {
          addNewBookObj[event.target.form[i].name] = event.target.form[i].value;
      }
      var addedBook = clientStore.queuedBooks.put(addNewBookObj); 
      addedBook
          .then(objectId => console.log("ID of book added: " + objectId))
          .catch(error => console.log(error));
      AddBooksModal.updateQueueCounter();
    }
    catch(error) {
      console.log(`Ooops: ${error}`);
    }
    event.target.form.reset();
    const queuedBooksArr = await clientStore.queuedBooks.toArray();
    return queuedBooksArr;
  }


  static updateQueueCounter = async () => {
    try {
      const queuedBooksArr = await clientStore.queuedBooks.toArray();
      document.getElementById('add-books-counter').innerHTML = queuedBooksArr.length;
    }
    catch(error) {
      console.log(`Ooops: ${error}`);
    }
  }


  static clearQueuedBooks = () => {
    clientStore.queuedBooks.clear();
    AddBooksModal.updateQueueCounter();
    return;
  }

  static captureCloseModal = (event) => {
    const { id, tabIndex } = event.target;
    if (id === 'addBooksModal' && tabIndex === -1) AddBooksModal.clearQueuedBooks()
  }
}