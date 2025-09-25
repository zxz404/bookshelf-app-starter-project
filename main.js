document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const editModal = document.getElementById("editModal");
  const editBookForm = document.getElementById("editBookForm");
  const closeModalBtn = document.querySelector(".close-button");
  const isCompleteCheckbox = document.getElementById("bookFormIsComplete");
  const submitButtonSpan = document.querySelector("#bookFormSubmit span");

  isCompleteCheckbox.addEventListener("change", function () {
    submitButtonSpan.textContent = this.checked ? "Selesai dibaca" : "Belum selesai dibaca";
  });

  loadBooks();

  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);

    bookForm.reset();
    submitButtonSpan.textContent = "Belum selesai dibaca";
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();

    if (searchTitle.trim() === "") {
      loadBooks();
      return;
    }

    const books = getBooksFromStorage();
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));

    renderBooks(filteredBooks);
  });

  closeModalBtn.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === editModal) {
      editModal.style.display = "none";
    }
  });

  editBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("editBookId").value;
    const title = document.getElementById("editBookTitle").value;
    const author = document.getElementById("editBookAuthor").value;
    const year = parseInt(document.getElementById("editBookYear").value);
    const isComplete = document.getElementById("editBookIsComplete").checked;

    updateBook(id, title, author, year, isComplete);

    editModal.style.display = "none";
  });

  function generateId() {
    return +new Date();
  }

  function getBooksFromStorage() {
    return JSON.parse(localStorage.getItem("books")) || [];
  }

  function addBook(title, author, year, isComplete) {
    const books = getBooksFromStorage();
    const newBook = {
      id: generateId(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(newBook);
    saveBooksToStorage(books);
    renderBooks(books);
  }

  function saveBooksToStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }


  function updateBook(id, title, author, year, isComplete) {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex((book) => book.id === parseInt(id));

    if (bookIndex !== -1) {
      books[bookIndex] = {
        id: books[bookIndex].id,
        title,
        author,
        year,
        isComplete,
      };

      saveBooksToStorage(books);
      renderBooks();
    }
  }

  function deleteBook(id) {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      const books = getBooksFromStorage();
      const updatedBooks = books.filter((book) => book.id != id);

      saveBooksToStorage(updatedBooks);
      renderBooks(updatedBooks);
    }
  }

  function toggleBookCompletion(id) {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex((book) => book.id == id);

    if (bookIndex !== -1) {
      books[bookIndex].isComplete = !books[bookIndex].isComplete;
      saveBooksToStorage(books);
      renderBooks(books);
    }
  }

  function openEditModal(book) {
    console.log("Book yg masuk ke modal:", book);
    document.getElementById("editBookId").value = book.id;
    document.getElementById("editBookTitle").value = book.title;
    document.getElementById("editBookAuthor").value = book.author;
    document.getElementById("editBookYear").value = book.year;
    document.getElementById("editBookIsComplete").checked = book.isComplete;

    editModal.style.display = "flex";
  }

  function renderBooks(books = null) {
    const booksToRender = books || getBooksFromStorage();

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    if (booksToRender.length === 0) {
      incompleteBookList.innerHTML = '<div class="book-item empty-message"><h3>Belum ada buku</h3></div>';
      completeBookList.innerHTML = '<div class="book-item empty-message"><h3>Belum ada buku</h3></div>';
    } else {
      booksToRender.forEach((book) => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      });
    }
  }

  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor"><i class="fas fa-user-pen"></i> Penulis: ${book.author}</p>
        <p data-testid="bookItemYear"><i class="fas fa-calendar"></i> Tahun: ${book.year}</p>
        <div class="book-actions">
          <button data-testid="bookItemIsCompleteButton" class="${book.isComplete ? "incomplete-btn" : "complete-btn"}">
            <i class="fas ${book.isComplete ? "fa-undo" : "fa-check"}"></i> ${book.isComplete ? "Belum selesai" : "Selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton" class="delete-btn">
            <i class="fas fa-trash"></i> Hapus
          </button>
          <button data-testid="bookItemEditButton" class="edit-btn">
            <i class="fas fa-edit"></i> Edit
          </button>
        </div>
      `;

    const toggleButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
    const deleteButton = bookItem.querySelector('[data-testid="bookItemDeleteButton"]');
    const editButton = bookItem.querySelector('[data-testid="bookItemEditButton"]');

    toggleButton.addEventListener("click", () => toggleBookCompletion(book.id));
    deleteButton.addEventListener("click", () => deleteBook(book.id));
    editButton.addEventListener("click", () => {
      console.log("Book yg mau di edit:", book);
      openEditModal(book);
    });
    return bookItem;
  }

  function loadBooks() {
    renderBooks();
  }
});
