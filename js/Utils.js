class Utils {

  static formatStr = (str) => {
    return str.toLowerCase().trim();
  }
  
  static handleEventTrigger(sEvent,oData) { 
    var oData = oData || {}
    if(sEvent){
      var event = new CustomEvent(sEvent,{'detail':oData})
      document.dispatchEvent(event) 
    }
  };

  static bookify = (bookArr) => {
    if (bookArr instanceof Array === false && bookArr instanceof Object) bookArr = [bookArr];
    return bookArr.map(book => {
      if (Utils.hasRequiredKeys(book)) return new Book(book)
    });
  };

  static unique = (array) => {
    return array.filter((e, i, arr) => arr.indexOf(e) === i);
  };

  static spacesToCamelCase = (str) => {
    const withSpaces = str.split(/(?=[A-Z]+)/).join(' ');
    const allWords = [];
    for (let i = 0; i < withSpaces.length; i++) {
      allWords.push(withSpaces[i]);
    };
    allWords[0] = allWords[0][0].toUpperCase() + allWords[0].slice(1, allWords[0].length);
    return allWords.join('');
  };

  static getFormData = (formId) => {
    let form = document.getElementById(formId)
  }

  static sortBooksById = (books) => {
    return books.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
  }

  static compareWithCached = async (books, cached) => {
    if (!cached) cached = await clientStore.bookShelf.toArray()
    if (books.length !== cached.length) return false;

    for (let i = 0; i < books.length; i++) {
      if (R.equals(books[i], cached[i]) === false) return false;
    }
    return true;
  }

  static hasRequiredKeys = (book) => {
    if(book.title && book.author) return true
    return false;
  }

  static closeTopModal = () => document.elementFromPoint(0, 0).click();
}