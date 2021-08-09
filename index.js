const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//Initialise express
const booky =  express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect("mongodb+srv://Gtswordsman1:<password>@zaapdb.dess3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
[
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
]
).then(() => console.log("Connection $Established"))

/*
Route         /
Description   Get all the books
Access        PUBLIC
Parameter     NONE
Method        GET
*/
booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*
Route         /is
Description   Get specific book on ISBN
Access        PUBLIC
Parameter     isbn
Method        GET
*/

booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route         /c
Description   Get specific book on category
Access        PUBLIC
Parameter     category
Method        GET
*/

booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    )

    if(getSpecificBook.length ===0) {
        return res.json({error: `No book found for the catefgory of ${req.params.category}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route         /ln
Description   Get specific book on language
Access        PUBLIC
Parameter     language
Method        GET
*/

booky.get("/ln/:Language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.Language
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the Language of ${req.params.Language}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route         /author
Description   Get book on author
Access        PUBLIC
Parameter     NONE
Method        GET
*/

booky.get("/author", (req,res) => {
    return res.json({authors: database.author});
});

/*
Route         /author/book
Description   Get specific book on authors book
Access        PUBLIC
Parameter     isbn
Method        GET
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length===0){
        return res.json({error: `No author found for the book of ${req.params.isbn}`})};

    return res.json({author: getSpecificAuthor});
    
});

/*
Route         /author
Description   Get specific book on authors ID
Access        PUBLIC
Parameter     II
Method        GET
*/

booky.get("/author/:ID",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === parseInt(req.params.ID)
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `No book found for the ID of ${req.params.ID}`})
    }

    return res.json({author: getSpecificAuthor});
});

/*
Route         /publications
Description   Get book on publication
Access        PUBLIC
Parameter     NONE
Method        GET
*/

booky.get("/publications",(req,res) => {
    return res.json({publication: database.publication});
});

/*
Route         /publications/book
Description   Get specific book on authors book
Access        PUBLIC
Parameter     isbn
Method        GET
*/

booky.get("/publications/book/:isbn", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length===0){
        return res.json({error: `No publication found for the book of ${req.params.isbn}`})};

    return res.json({author: getSpecificPublication});
    
});

/*
Route         /publications
Description   Get specific book on authors ID
Access        PUBLIC
Parameter     ID
Method        GET
*/

booky.get("/publications/:ID",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === parseInt(req.params.ID)
    );

    if(getSpecificPublication.length === 0) {
        return res.json({error: `No book found for the ID of ${req.params.ID}`})
    }

    return res.json({author: getSpecificPublication});
});

//POST

/*
Route         /book/new
Description   Add new books
Access        PUBLIC
Parameter     NONE
Method        POST
*/

booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});


/*
Route         /author/new
Description   Add new authors
Access        PUBLIC
Parameter     NONE
Method        POST
*/

booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json(database.author);
});

/*
Route         /publication/new
Description   Add new publications
Access        PUBLIC
Parameter     NONE
Method        POST
*/

booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json(database.publication);
});

/*
Route         /publication/update/book
Description   Update /add new publication
Access        PUBLIC
Parameter     isbn
Method        PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    //Update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId){
           return pub.books.push(req.params.isbn);
        }
    });

    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN ===req.params.isbn){
            book.publications =req.body.pubId;
            return;
        }
    });

    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publications"
        }
    );
});

/****DELETE*****/
/*
Route         /book/delete
Description   Delete a book
Access        PUBLIC
Parameter     isbn
Method        DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    //Whichever book that does not match with the isbn, just send
    //and rest will be filltered aut
    
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});




/*
Route         /book/delete/author
Description   Delete an author from a book and vice versa
Access        PUBLIC
Parameter     isbn, authorId
Method        PUT
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //Update the book database
    database.books.forEach((book) =>{
        if(book.ISBN ===req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;

        }
    });

    //Update the author database
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!!!!"
    });
    //update the author database
});

booky.listen(3000, () => {
    console.log("Server is up and running");
});