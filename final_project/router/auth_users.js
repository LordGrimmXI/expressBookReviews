const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/; // Regular expression for valid usernames
    return usernameRegex.test(username);
}

const authenticatedUser = (username, password) => {
  // check if username exists in user database
  if (regd_users[username]) {
    // check if password matches the one stored in user database
    if (regd_users[username].password === password) {
      return true; // authentication successful
    }
  }
  return false; // authentication failed
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Check if the user is registered
    const user = registeredUsers.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Authentication successful
    return res.status(200).json({ message: "Login successful" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already posted a review for this book
    const userReview = books[isbn].reviews[username];
    if (userReview) {
      // Modify the existing review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified" });
    } else {
      // Add a new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: `Review added for Author ${ isbn }` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has posted a review for this book
    const userReview = books[isbn].reviews[username];
    if (!userReview) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    // Delete the review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted" });
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
