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

var bookListRequest = new Promise(function(resolve, reject){
  resolve(books);
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  bookListRequest.then(function(data){
    return res.status(200).json(data)
  })
});

function getBookByIsbn(isbn){
  return new Promise((resolve, reject) => {
  resolve(books[isbn])
});
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params["isbn"]
  let book = await getBookByIsbn(isbn);
  return res.status(200).json(book);
 });

 function getBookByAuthor(author){
  return new Promise((resolve, reject) => {
  let book_array = Object.values(books)
  resolve(book_array.find(book => book.author === author));

});
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params["author"];
  const book = await getBookByAuthor(author);
  return res.status(200).json(book);
});

 function getBookByTitle(title){
  return new Promise((resolve, reject) => {
  let book_array = Object.values(books)
  resolve(book_array.find(book => book.title === title));

});
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params["title"]
  const book = await getBookByTitle(title);
  return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params["isbn"]
  let book = books[isbn]
  return res.status(200).json(book["reviews"]);
});

module.exports.general = public_users;
