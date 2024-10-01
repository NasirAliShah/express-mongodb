require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const app = express();
app.listen(3000, () => console.log('Servier is runing'));
mongoose.connect('mongodb://localhost:27017/books')

const bookSchema = new mongoose.Schema({
  book_no: Number,
  book_name: String,
  book_publication_date: Number,
  book_versions: [String]
})

const Book = mongoose.model('Book', bookSchema);

const book1 = new Book({
  book_no: 1001,
  book_name: 'Madison Hyde',
  book_publication_date: 3,
  book_versions: ['v1', 'v2']
});
app.post('/book', async (req, res) => {
  try {

    // Create a new Book document from the request body
    const book = new Book(req.body);

    // Save the book to the database
    const savedBook = await book.save();

    // Send the ID and the saved book details back as a response
    res.status(201).send({ id: savedBook._id, book: savedBook });
  } catch (err) {
    console.log("Error occurred, " + err);
    res.status(500).send("Some error occurred!");
  }
});
// book1.save().then(() => console.log('one entry added'),
// (err) => console.log(err));

app.get('/', async (req, res) => {
  try {
    const books = await Book.find({});
    res.send(books);
  } catch (err) {
    console.log("Error occurred, " + err);
    res.status(500).send("Some error occurred!");
  }
});
app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const books = await Book.findById(id);
    res.send(books);
  } catch (err) {
    console.log("Error occurred, " + err);
    res.status(500).send("Some error occurred!");
  }
});
