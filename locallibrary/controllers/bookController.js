const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      book_count: (cb) => {
        Book.countDocuments({}, cb);
      },
      book_instance_count: (cb) => {
        BookInstance.countDocuments({}, cb);
      },
      book_instance_available_count: (cb) => {
        BookInstance.countDocuments({ status: "Available" }, cb);
      },
      author_count: (cb) => {
        Author.countDocuments({}, cb);
      },
      genre_count: (cb) => {
        Genre.countDocuments({}, cb);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all books
exports.book_list = (req, res, next) => {
  Book.find({}, "title author")
    .populate("author")
    .exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      console.log("List books", list_books);
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
};

// Display detail page for a specific book
exports.book_detail = (req, res, next) => {
  async.parallel(
    {
      book: (cb) => {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(cb);
      },

      book_instance: (cb) => {
        BookInstance.find({ book: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book === null) {
        const err = new Error("Book not Found");
        err.status = 404;
        return next(err);
      }

      res.render("book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

// Display book create form on GET
exports.book_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST
exports.book_create_post = (req, res) => {
  re.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};
