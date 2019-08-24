let pageNum = 1;
let resultsPerPage = 5;

class DataTable {

  static init = () => {
    DataTable._makeTable();
    DataTable._bindEvents();
  }


  static _bindEvents = () => {
    document.addEventListener('objUpdate',DataTable._updateTable) 
    document.getElementById('nextPage').addEventListener('click',() => {
      DataTable.pageUp();
    })
    document.getElementById('prevPage').addEventListener('click',() => {
      DataTable.pageDown();
    })
  }


  static getBooksByPage = async (pageNum, resultsPerPage) => {
    let offsetNum = (pageNum - 1) * resultsPerPage;
    if (pageNum === 1){
      let prevBtn = document.getElementById('prevPage');
      prevBtn.style.display = 'none';
    }
    const getBooksByPageArr = await clientStore.bookShelf.orderBy('title').offset(offsetNum).limit(resultsPerPage).toArray();
    return getBooksByPageArr;
  }


  static pageUp = async () => {
    const bookShelfArr = await clientStore.bookShelf.toArray();
    let lastPageNum = Math.ceil(bookShelfArr.length / Number(resultsPerPage));
    let nextBtn = document.getElementById('nextPage');
    let prevBtn = document.getElementById('prevPage');
    prevBtn.style.display = 'inline';
    if (pageNum !== lastPageNum) {
      pageNum++;
      nextBtn.style.display = 'inline';
      Utils.handleEventTrigger('objUpdate',bookShelfArr);
    } else {
      nextBtn.style.display = 'none';
    }
    return;
  }


  static pageDown = async () => {
    const bookShelfArr = await clientStore.bookShelf.toArray();
    let firstPageNum = 1;
    let prevBtn = document.getElementById('prevPage');
    pageNum--;
    if (pageNum !== firstPageNum) {
      prevBtn.style.display = 'inline';
      Utils.handleEventTrigger('objUpdate',bookShelfArr);
    } else {
      prevBtn.style.display = 'none';
    }
    return;
  }

  static _updateTable = (e) => {
    DataTable._makeTable() 
  }

  static _makeTable = async (booksThisPage) => {
    if (!booksThisPage) booksThisPage = await DataTable.getBooksByPage(pageNum, resultsPerPage)

    const table = document.getElementById('dataTable');
    const tHead = document.getElementById('dataTableHead')
    table.innerHTML = null;
    tHead.innerHTML = null;

    tHead.appendChild(DataTable._createHead(new Book({})))
    if (booksThisPage) booksThisPage.forEach(book => {
      document.getElementById('dataTable').appendChild(DataTable._createRow(book))
    })
  }

  static _createHead = (book) => {
    const row = document.createElement('tr');
    for (let key in book) {
      if (key !== 'id') {
        const th = document.createElement('th');
        th.innerText = Utils.spacesToCamelCase(key);
        row.appendChild(th)
      }
    }
    const th = document.createElement('th');
    th.innerText = 'Delete Book';
    row.appendChild(th);
    return row;
  }

  static _createRow = (book) => {
    const row = document.createElement('tr');

    for (let key in book) {
      const td = document.createElement('td');
      switch (key) {
        case 'id':
          break;
        case 'cover':
          const img = document.createElement('img');
          img.classList.add('tableImg');
          img.setAttribute('src', book[key]); 
          img.setAttribute('src', './assets/covers/generic_cover.png')
          td.appendChild(img);
          break;
        case 'rating':
          td.append(DataTable._stars(book[key]));
          break;
        case 'synopsis':
          td.innerHTML = `${book[key].slice(0, 85)}...`;
          break;
        default:
          td.innerHTML = book[key]
          break;
      }

      if (key !== 'id') {
        td.setAttribute('data-bookid', book.id)
        td.setAttribute('data-toggle', 'modal');
        td.setAttribute('data-target', '#editBookModal');
        td.addEventListener('click', EditBookModal.toggleEditModal)

        row.appendChild(td)
      }
    }

    row.append(DataTable._createDeleteButton(book.id))
    return row;
  }

  static _createDeleteButton = (id) => {
    const deleteTd = document.createElement('td');
    const deleteCheckbox = document.createElement('input');
    deleteCheckbox.setAttribute('type', 'checkbox');
    deleteCheckbox.setAttribute('data-bookid', id)
    deleteCheckbox.addEventListener('click', RemoveBooksModal.toggleDeleteModal)
    deleteTd.appendChild(deleteCheckbox);
    return deleteTd;
  }

  static _stars = (rating) => {
    const starDiv = document.createElement('div');
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.classList.add('fa', 'fa-star');
      if (i < rating) star.classList.add('checked');
      starDiv.appendChild(star);
    }
    return starDiv;
  }
}