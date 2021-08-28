const express = require("express");
var bodyParser = require("body-parser");
// Database
const database = require("./database");
// initialize express

const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());
/*
Route           /
Description     Get all books
Access          Public
Parameter       none
Methods         GET
*/
booky.get("/",(req,res)=>{
    return res.json({books: database.books});
}); 

/*
Route           /is
Description     Get specific book on ISBN
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }
    return res.json({books: getSpecificBook});
}); 
/*
Route           /c
Description     Get specific book on category
Access          Public
Parameter       category
Methods         GET
*/
booky.get("/c/:category",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }
    return res.json({books: getSpecificBook});
}); 
/*
Route           /l
Description     get a list of books based on languages
Access          Public
Parameter       language
Methods         GET
*/
booky.get("/l/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for language of ${req.params.language}`})
    }
    return res.json({books: getSpecificBook});
}); 
/*
Route           /author
Description     Get all authors
Access          Public
Parameter       none
Methods         GET
*/
booky.get("/author", (req,res) => {
    return res.json({author: database.author});
}); 
/*
Route           /author
Description     get a specific author based on id
Access          Public
Parameter       id
Methods         GET
*/
booky.get("/author/:id",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.id === req.params.id
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No book found for the author of ID ${req.params.id}`})
    }
    return res.json({author: getSpecificAuthor});
}); 
/*
Route           /author/book
Description     To get a list of authors based on books
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn",(req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({error: `No book found for the author of isbn ${req.params.isbn}`})
    }
    return res.json({books: getSpecificAuthor});
}); 
/*
Route           /publication
Description     Get all publication
Access          Public
Parameter       none
Methods         GET
*/
booky.get("/publications",(req,res)=>{
    return res.json({publication: database.publication});
}); 
/*
Route           /publication
Description     To get a specific publication
Access          Public
Parameter       id
Methods         GET
*/
booky.get("/publication/:id",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === req.params.id
    );

    if(getSpecificPublication.length === 0){
        return res.json({error: `No book found for the publication of ${req.params.id}`})
    }
    return res.json({publication: getSpecificPublication});
}); 
/*
Route           /publication/book
Description     To get a list of publications based on a books
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/publication/book/:isbn",(req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

    if(getSpecificPublication.length === 0){
        return res.json({error: `No book found for the publication ${req.params.isbn}`})
    }
    return res.json({publication: getSpecificPublication});
}); 


// POST

/*
Route           /book/new
Description     Add new books
Access          Public
Parameter       none
Methods         POST
*/
booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route           /author/new
Description     Add new author
Access          Public
Parameter       none
Methods         POST
*/

booky.post("/author/new", (req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthor: database.author})
});

/*
Route           /publication/new
Description     Add new publication
Access          Public
Parameter       none
Methods         POST
*/

booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublication: database.publication});
});

/*
Route           /publication/update/book
Description     Update or add new publication
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    // update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    // update the books database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publications = req.body.pubId;
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

/*****DELETE****/

/*
Route           /book/delete
Description     Delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    // whichever book that does not match with isbn just send it
    // updated database array and rest will be filtered out
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
Route           /author/delete
Description     Delete an author
Access          Public
Parameter       id
Methods         DELETE
*/

booky.delete("/author/delete/:Id", (req,res) => {

    const updatedAuthorDatabase = database.author.filter(
        (author) => author.id !== req.params.Id
    )
    database.author = updatedAuthorDatabase;

    return res.json({author: database.author});
});

/*
Route           book/delete/author
Description     Delete author from book and related book from author
Access          Public
Parameter       isbn,authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    // Update the book database 
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    // Update the author database 
    
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    })

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted !!!"
    })
});

booky.listen(3000,() => {
    console.log("Server is up and running");
});