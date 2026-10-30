const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        users.push({ username: username, password: password });

        return res.status(201).json({
            message: "User successfully registered"
        });
    }

    return res.status(400).json({
        message: "Username and password are required"
    });
});

public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = {};

    for (const isbn in books) {
        if (books[isbn].author.toLowerCase() === author) {
            result[isbn] = books[isbn];
        }
    }

    res.send(result);
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = {};

    for (const isbn in books) {
        if (books[isbn].title.toLowerCase() === title) {
            result[isbn] = books[isbn];
        }
    }

    res.send(result);
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

module.exports.general = public_users;
