const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    try {
        const { username, password } = req.body; // extract username and password from request body
        if (!username || !password) { // check if username or password is not provided
          return res.status(400).json({ message: 'Username and password are required' }); // return 400 status code with error message
        }
        if (users[username]) { // check if username already exists
          return res.status(409).json({ message: 'Username already exists' }); // return 409 status code with error message
        }
        users[username] = password; // add new user to the users object
        return res.status(200).json({ message: 'User registered successfully' }); // return 200 status code with success message
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' }); // return 500 status code with error message
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    try {
      return res.status(200).json(books); // return the list of books as JSON
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
});

public_users.get('/auth/review/1', function(req, res) {
    return res.status(200).json({msg: "Review deleted"})
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
        const isbn = req.params.isbn; // get the ISBN from the request parameters
        const book = books[isbn]; // find the book with the matching ISBN
        if (!book) {
          return res.status(404).json({ message: 'Book not found' }); // return a 404 error if book is not found
        }
        return res.status(200).json({ [isbn] : book }); // return the book details as JSON
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        const author = req.params.author; // get the author name from the request parameters
        const authorBooks = Object.values(books).filter((b) => b.author === author); // filter books by author
        if (authorBooks.length === 0) {
          return res.status(404).json({ message: 'Books not found for this author' }); // return a 404 status code if no books are found for the author
        }
        return res.status(200).json(authorBooks); // return the books details as a JSON response
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
        const title = req.params.title; // get the title name from the request parameters
        const titleBooks = Object.values(books).filter((b) => b.title === title); // filter books by title
        if (titleBooks.length === 0) {
          return res.status(404).json({ message: 'Books not found for this title' }); // return a 404 status code if no books are found for the title
        }
        return res.status(200).json(titleBooks); // return the books details as a JSON response
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    try {
        const isbn = req.params.isbn; // get the ISBN from the request parameters
        const book = books[isbn]; // get the book object with the matching ISBN
        if (!book) {
          return res.status(404).json({ message: 'Book not found' }); // return a 404 status code if the book is not found
        }
        const reviews = book.reviews; // get the reviews object for the book
        return res.status(200).json(reviews); // return the reviews as a JSON response
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports.general = public_users;
