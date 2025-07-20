const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  if (username in users){
    return users[username] == password;
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (!("username" in req.body) || !("password" in req.body)){
    return res.status(400).json({"message": "missing username or password"});
  }

  let username = req.body["username"];
  let password = req.body["password"];

  
   if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("user logged in");
  } else {
    return res.status(208).json({ message: "invalid login" });
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params["isbn"];
  if (!req.session.authorization || !req.session.authorization["username"]) {
    return res.status(401).json({ message: "user not logged in" });
  }
  let username = req.session.authorization["username"];
  let book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const review = req.body["review"];
  if (typeof review !== "string" || review.trim() === "") {
    return res.status(400).json({ message: "missing review" });
  }

  book["reviews"][username] = review;

  return res.status(200).json({message: "review set"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
