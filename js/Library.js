class Library {

  static init = () => {
    Library.populateBookshelf();
  }


  static populateBookshelf = async () => {
    try {
      let databaseCount = await Library.getBookCount(); 
      let cacheCount = await clientStore.bookShelf.count() 
      if(cacheCount !== databaseCount.numberOfDocs) { 
        const booksFromApi = await Library.getAllBooks(); 
        Library.bulkPutToClientStorage(booksFromApi); 
        return;
      } else {
        const bookShelfArr = await clientStore.bookShelf.toArray()
        return bookShelfArr;
      }
    }
    catch(error) {
      console.log(`Ooops: ${error}`);
    }
  };


  static getAllBooks = async () => {
    const failArr = [];
    const books = await axios.get('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/200/?timeStamp=0')
      .catch(function (error) {
        console.log(`Ooops: ${error}`);
        return failArr;
      })
    return books.data; 
  };

  static getBookCount = async () => {
    const bookCount = await axios.get('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/totalCount')
      .catch(function (error) {
        return console.log(`Ooops: ${error}`);
      })
    return bookCount.data.numberOfDocs; 
  };


  static bulkPutToClientStorage = (booksArr) => {
    let processedBooks = [];
    for (let i = 0; i < booksArr.length; i++) {
      let newBookInstance = new Book(booksArr[i]); 
      processedBooks.push(newBookInstance);
    }
    const sortedBooksArr = Utils.sortBooksById(processedBooks);
    const validatedBooksArr = Utils.bookify(sortedBooksArr);
    for (let i = 0; i < validatedBooksArr.length; i++){
      var addedBook = clientStore.bookShelf.add(validatedBooksArr[i]);
      addedBook
          .then(() => console.log("Book added: " + validatedBooksArr[i].title))
          .catch(error => console.log(error));
    }
    Utils.handleEventTrigger('objUpdate',validatedBooksArr); 
    return;
  };

  static fetchAndStoreUpdates = async (forceUpdate) => {
    try {
      let numDocs = await axios
        .get(`${baseUrl}/library/totalCount`)
        .then(res => res.data.numberOfDocs)
      
      let cachedBooks = await clientStore.bookShelf.toArray();
      
      if(numDocs !== cachedBooks.length && !forceUpdate) {

        let fetchedBooks = await Library.getAllBooks();

        cachedBooks = Utils.sortBooksById(Utils.bookify(cachedBooks));
        fetchedBooks = Utils.sortBooksById(Utils.bookify(fetchedBooks));
        
        if (await Utils.compareWithCached(fetchedBooks, cachedBooks) === false) {
          Library.bulkPutToClientStorage(fetchedBooks);
          return fetchedBooks;
        }
      } else {
        console.log(`Number of records in db matches number of cached books, no changes have been made`)
        return cachedBooks;
      }
    } catch(err) {
      console.log(`Error from Library.fetchAndStoreUpdates`)
    }
  };

  
  static addBooks = async (queuedBooksArr) => {
    queuedBooksArr = await clientStore.queuedBooks.toArray();
    await axios.post('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library',{
      books: queuedBooksArr
    });
    Library.fetchAndStoreUpdates(true);
    return;
  };


  static editBook = async (event,id) => {
    event.preventDefault();
    try {
      var editBookObj = {};
      for (var i = 0; i < event.target.form.length - 2; i++) {
          editBookObj[event.target.form[i].name] = event.target.form[i].value;
      }
      await axios.put(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/update/${id}`,editBookObj);
      Library.fetchAndStoreUpdates(true);
    }
    catch(error) {
      console.log(`Ooops: ${error}`);
    }
    return;
  };


  static suggestBook = async () => {
    const suggestedBook = await axios.get('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/random')
      .catch(function (error) {
        console.log(`Ooops: ${error}`);
        return;
      })
    DataTable._makeTable(suggestedBook.data);
    return suggestedBook.data;
  };


  static deleteBooksByTitle = async (e) => {
    let titleToDelete = e.target.form[0].value;
    let authorToDelete = e.target.form[1].value;
    if (!authorToDelete && titleToDelete){
      let confirmation = window.confirm("Are you sure you would like to delete all books with title " + titleToDelete + "?");
      if (confirmation === true) {
        axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteBy/?title=${titleToDelete}`)
        .catch(error=> console.log(error));

      } else {
        return;
      }
    } else if (authorToDelete && !titleToDelete){
      let confirmation = window.confirm("Are you sure you would like to delete all books by " + authorToDelete + "?");
      if (confirmation === true) {
        axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteBy/?author=${authorToDelete}`)
        .catch(error=> console.log(error));
      } else {
        return;
      }
    } else {
      let confirmation = window.confirm("Are you sure you would like to delete all copies of " + titleToDelete + " by " + authorToDelete + "?");
      if (confirmation === true) {
        axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteBy/?title=${titleToDelete}&author=${authorToDelete}`)
        .catch(error=> console.log(error));
      } else {
        return;
      }
    }
    Library.fetchAndStoreUpdates(true);
    return;
  };


  static deleteBookById = async (id) => {
    axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteById/${id}`)
    .catch(error=> console.log(error)); 
    Library.fetchAndStoreUpdates(true);
    return;
  };


  static searchBy = async (e) => {
    let title = e.target.elements[1].value;
    let author = e.target.elements[2].value;
    try {
      e.preventDefault();
      let desiredBook = await axios.get(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/searchBy/?title=${title}&author=${author}`)
      .catch(error=> console.log(error)); 
      if (typeof desiredBook.data[0] === 'string'){
        if ((title && author) && (desiredBook.data[0].includes("Sorry")) && (desiredBook.data[1].includes("Sorry"))){
          alert(desiredBook.data[0] + "\n" + desiredBook.data[1]);
        } else if ((title && !author) && (desiredBook.data[0].includes("Sorry"))){
          alert(desiredBook.data[0]);
        } else if ((!title && author) && (desiredBook.data[0].includes("Sorry"))){
          alert(desiredBook.data[0]);
        }}
      else {
        let returnedBooks = "";
        for (let i = 0; i < desiredBook.data.length; i++){
        returnedBooks += ("Book found: " + desiredBook.data[i].title + " by " + desiredBook.data[i].author + "\n");
        }
        alert(returnedBooks);
      }
      return;
    }
    catch(error) {
      console.log(`Ooops: ${error}`);
    }
  };
};