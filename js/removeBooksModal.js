class RemoveBooksModal {

  static init = () => {
    RemoveBooksModal.bindEvents()
  }

  static bindEvents = () => {
    document.getElementById('remove-book-button').addEventListener('click',(e) => {
      Library.deleteBooksByTitle(e);
    })
  }

  static toggleDeleteModal = async (e) => {
    Utils.closeTopModal();
    let bookToDeleteId = e.target.dataset.bookid;
    let bookToDelete = await clientStore.bookShelf.get(bookToDeleteId);
    let confirmation = window.confirm("Are you sure you would like to delete " + bookToDelete.title + "?");
    if (confirmation === true) {
      Library.deleteBookById(bookToDeleteId);
      Library.fetchAndStoreUpdates(true);
      return;
    } else {
      return;
    }
  }
  return;
}