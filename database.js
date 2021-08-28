
 const books = [
  {
    ISBN: "12345Book",
    title: "Tesla",
    pubDate: "17-08-2021",
    language: 'en',
    numPage: 300,
    author: [1,2],
    publications: [1],
    category: ["Tech","Space","Edu"]
  }

 ];

 const author = [
  {
    id: 1,
    name: "GT",
    books: ["12345Book","Secret Book"]
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["12345Book"]
  }
 ];

 const publication = [
  {
    id: 1,
    name: "DK",
    books: ['12345Book']
  },
  {
    id: 2,
    name: "Writex",
    books: []
  }
 ];

 module.exports = {books,author,publication}