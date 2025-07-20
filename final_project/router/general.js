const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  if (!("username" in req.body) || !("password" in req.body)){
    return res.status(400).json({"message": "missing username or password"});
  }

  let username = req.body["username"];
  let password = req.body["password"];

  if (username in users){
    return res.status(409).json({"message": "user already exists"});
  }

  users[username] = password;

  return res.status(200).json({"message": "user registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params["isbn"]
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params["author"]
  let book_array = Object.values(books)
  const book = book_array.find(book => book.author === author);
  return res.status(200).json(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params["title"]
  let book_array = Object.values(books)
  const book = book_array.find(book => book.title === title);
  return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params["isbn"]
  let book = books[isbn]
  return res.status(200).json(book["reviews"]);
});

module.exports.general = public_users;
