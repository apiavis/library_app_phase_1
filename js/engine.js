// globally define the baseUrl for where our cloud functions are deployed
// This is the API endpoint
const baseUrl = 'https://us-central1-library-backend-firebase.cloudfunctions.net/api'

const clientStore = new Dexie('clientStore')

clientStore.version(1).stores({
  bookShelf: "id,title,pubDate,author,rating,cover,numPages,synopsis",
  queuedBooks: "++id,title,pubDate,author,rating,cover,numPages,synopsis",
})

window.addEventListener('DOMContentLoaded', () => {
  Library.init();
  DataTable.init();
  AddBooksModal.init();
  EditBookModal.init();
  RemoveBooksModal.init();
  SearchBy.init();
  SuggestBookModal.init();
});