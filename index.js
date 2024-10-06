const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());

const books = [
  {
    id: '1',
    title: 'Book 1',
    description: 'Описание 1',
    author: 'Author 1',
    favorite: 'favorite 1',
    fileCover: 'image1.jpg',
    fileName: 'book1.pdf'
  },
  {
    id: '2',
    title: 'Book 2',
    description: 'Описание 2',
    author: 'Author 2',
    favorite: 'favorite 2',
    fileCover: 'image2.jpg',
    fileName: 'book2.pdf'
  }
];

app.get('/', (_, res) => {
  res.render('index', { books });
});

app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  const book = books.find(book => book.id === id);
  if (book) {
    res.render('view', { book });
  } else {
    res.status(404);
    res.json({ status: 'Book not found' });
  }
});

app.get('/book/create', (req, res) => {
  const book = {
    description: '',
    author: '',
    favorite: '',
    fileCover: '',
    fileName: ''
  };
  res.render('create', { book });
});

app.post('/book/create', (req, res) => {
  const { title, description, author, favorite, fileCover, fileName } = req.body;
  const id = uuid();
  const newBook = { id, title, description, author, favorite, fileCover, fileName };
  if (!title) {
    res.status(400).render('create', {
        error: 'Title is required',
        book: newBook
    });
    return;
  }
  books.push(newBook);
  res.redirect('/');
});

app.get('/book/update/:id', (req, res) => {
  const id = req.params.id;
  const book = books.find(book => book.id === id);
  if (book) {
    res.render('update', { book });
  } else {
    res.status(404);
    res.json({ status: 'Book not found' });
  }
});

app.post('/book/update/:id', (req, res) => {
  const id = req.params.id;
  const { title, description, author, favorite, fileCover, fileName } = req.body;
  const book = books.find(book => book.id === id);
  if (book) {
    book.title = title;
    book.description = description;
    book.author = author;
    book.favorite = favorite;
    book.fileCover = fileCover;
    book.fileName = fileName;
    res.redirect('/');
  } else {
    res.status(404);
    res.json({ status: 'Book not found' });
  }
});

app.listen(PORT, () => console.log(`App listening on ${PORT}`));