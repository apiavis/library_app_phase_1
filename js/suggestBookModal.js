class SuggestBookModal {

  static init = () => {
    SuggestBookModal.bindEvents()
  }

  static bindEvents = () => {
    document.getElementById('suggestBookBtn').addEventListener('click',() => {
      Library.suggestBook();
    })
  }
}