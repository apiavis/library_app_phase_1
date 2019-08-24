class Book {
  constructor(bookObj) {
  this.id = bookObj.id; 
  this.cover = bookObj.cover || '';
  this.title = bookObj.title; 
  this.author = bookObj.author; 
  this.timeStamp = bookObj.timeStamp
  this.synopsis = bookObj.synopsis;
  this.numPages = parseInt(bookObj.numPages);
  this.pubDate = new Date(bookObj.pubDate).getFullYear(); 
  this.rating = parseInt(bookObj.rating);
  }
}