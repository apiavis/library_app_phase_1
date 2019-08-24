class EditBookModal {

  static init = () => {
    EditBookModal.bindEventListeners()
  }

  static bindEventListeners = () => {
    document.getElementById('submit-edit-button').addEventListener('click',(event,id) => {
      let idDiv = document.getElementById('book-id-holder');
      id = idDiv.innerHTML;
      idDiv.remove();
      Library.editBook(event,id);
    })
  }


  static toggleEditModal = async (e) => {
    Utils.closeTopModal();
    let bookToEditId = e.target.dataset.bookid;
    let id_holder = document.createElement('div');
    id_holder.id = 'book-id-holder';
    id_holder.innerHTML = bookToEditId;
    id_holder.style.display = 'none';
    document.getElementById('editBookModalForm').appendChild(id_holder);
    let bookToEdit = await clientStore.bookShelf.get(bookToEditId);
    EditBookModal.populateEditModal(bookToEdit);
    return;
  }


  static populateEditModal = (bookData) => {
    const bookKeysArr = ['title','author','rating','numPages','pubDate','synopsis','cover'];
    const formIdsArr = ['title-edit-input','author-edit-input','rating-edit-input','pages-edit-input','date-edit-input','synopsis-edit-input','cover-edit-input'];
    for (let i = 0; i < bookKeysArr.length; i++) {
      let key = bookKeysArr[i];
      let formElement = document.getElementById(formIdsArr[i]);
      formElement.value = bookData[key];
    }
  }
}