class SearchBy {

  static init = () => {
    SearchBy.bindEvents()
  }

  static bindEvents = () => {
    document.getElementById('search-form').addEventListener('submit',(e) => {
      Library.searchBy(e); 
    })
  }
}