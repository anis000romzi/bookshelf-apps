const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function addBook(isCompleted) {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;

  if (title == "" && author == "" && year == "")
    alert("You haven't write a THING!");
  else if (title == "") alert("You haven't write the TITLE!");
  else if (author == "") alert("You haven't write the AUTHOR!");
  else if (year == "") alert("You haven't write the YEAR of RELEASE!");
  else {
    const generatedID = +new Date();
    const bookObject = createBookObject(
      generatedID,
      title,
      author,
      year,
      isCompleted
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function searchingBook() {
  const searchBar = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = document.querySelectorAll(".book_list article");

  // Cari buku berdasarkan judul/title
  for (let listOfBook of bookList) {
    if (listOfBook.getAttribute("data-value").toLowerCase().indexOf(searchBar) > -1)
      listOfBook.style.display = "";
    else listOfBook.style.display = "none";
  }
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) return bookItem;
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) return index;
  }
  return -1;
}

function createBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function finishBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function readBookAgain(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  let editTitle = prompt("What's the right TITLE?", bookTarget.title);
  let editAuthor = prompt("Who's the right AUTHOR?", bookTarget.author);
  let editYear = prompt("What's the right release YEAR?", bookTarget.year);

  if (editTitle != null) bookTarget.title = editTitle;
  if (editAuthor != null) bookTarget.author = editAuthor;
  if (editYear != null) bookTarget.year = editYear;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function createBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Author: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Release Year: ${bookObject.year}`;

  const textContainer = document.createElement("article");
  // data-value untuk mencari buku berdasarkan judul/title
  textContainer.setAttribute("data-value", bookObject.title);
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textYear);

  if (bookObject.isCompleted) {
    const containerButton = document.createElement("div");
    containerButton.classList.add("action");

    const readAgainButton = document.createElement("button");
    readAgainButton.classList.add("primary");
    readAgainButton.innerText = "Read Again";

    readAgainButton.addEventListener("click", function () {
      readBookAgain(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("secondary");
    deleteButton.innerText = "Delete Book";

    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerText = "Edit Book";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    containerButton.append(readAgainButton, deleteButton, editButton);
    textContainer.append(containerButton);
  } else {
    const containerButton = document.createElement("div");
    containerButton.classList.add("action");

    const finishButton = document.createElement("button");
    finishButton.classList.add("primary");
    finishButton.innerText = "Finish Reading";

    finishButton.addEventListener("click", function () {
      finishBook(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("secondary");
    deleteButton.innerText = "Delete Book";

    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerText = "Edit Book";

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    containerButton.append(finishButton, deleteButton, editButton);
    textContainer.append(containerButton);
  }

  return textContainer;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitFormReading = document.getElementById("inputBookReading");
  const submitFormFinish = document.getElementById("inputBookFinish");
  const searchBook = document.getElementById("searchBook");
  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchingBook(); // Mencari buku
  });
  submitFormReading.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook(false); // isCompleted = false
  });
  submitFormFinish.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook(true); // isCompleted = true
  });
  if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBookShelfList = document.getElementById("incompleteBookshelfList");
  incompletedBookShelfList.innerHTML = "";

  const completedBookShelfList = document.getElementById("completeBookshelfList");
  completedBookShelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBook(bookItem);
    if (!bookItem.isCompleted) incompletedBookShelfList.append(bookElement);
    else completedBookShelfList.append(bookElement);
  }
});
