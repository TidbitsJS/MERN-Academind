const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

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
      res.render("lists/book_list", {
        title: "Book List",
        book_list: list_books,
      });
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

      res.render("details/book_detail", {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance,
      });
    }
  );
};

// Display book create form on GET
exports.book_create_get = (req, res, next) => {
  // Get all authors and genres which we can use for adding to our book.
  async.parallel(
    {
      authors: (cb) => Author.find(cb),
      genres: (cb) => Genre.find(cb),
    },
    (err, results) => {
      if (err) return next(err);
      res.render("forms/book_form", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
};

// Handle book create on POST
exports.book_create_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }

    next();
  },

  // Validate and sanitise fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty.").trim().isLength({ min: 10 }).escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // Create a Book object
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // Render sanitized error messages

      async.parallel(
        {
          authors: (cb) => {
            Author.find(cb);
          },
          genres: (cb) => {
            Genre.find(cb);
          },
        },
        (err, results) => {
          if (err) return next(err);

          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }

          res.render("forms/book_form", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      book.save((err) => {
        if (err) return next(err);

        res.redirect(book.url);
      });
    }
  },
];

// Display book delete form on GET
exports.book_delete_get = (req, res, next) => {
  async.parallel(
    {
      book: (cb) => {
        Book.findById(req.params.id).populate("genre").exec(cb);
      },
      book_bookinstances: (cb) => {
        BookInstance.find({ book: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book === null) res.redirect("/catalog/books");

      res.render("deletes/book_delete", {
        title: "Delete Book",
        book: results.book,
        book_instances: results.book_bookinstances,
      });
    }
  );
};

// Handle book delete on POST
exports.book_delete_post = (req, res) => {
  async.parallel(
    {
      book: (cb) => {
        Book.findById(req.body.id)
          .populate("author")
          .populate("genre")
          .exec(cb);
      },
      book_bookinstances: (cb) => {
        BookInstance.find({ book: req.body.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book_bookinstances.length > 0) {
        // Book has book_instances.
        res.render("deletes/book_delete", {
          title: "Delete Book",
          book: results.book,
          book_instances: results.book_bookinstances,
        });
        return;
      } else {
        // Book has no BookInstance objects. Delete object
        Book.findByIdAndRemove(req.body.id, (err) => {
          if (err) return next(err);
          res.redirect("/catalog/books");
        });
      }
    }
  );
};

// Display book update form on GET
exports.book_update_get = (req, res, next) => {
  // Get book, authors and genres for form
  async.parallel(
    {
      book: (cb) => {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(cb);
      },
      authors: (cb) => {
        Author.find(cb);
      },
      genres: (cb) => {
        Genre.find(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.book === null) {
        const error = new Error("Book not found");
        error.status = 404;
        return next(error);
      }

      // Mark out selected genres as checked
      for (
        let all_g_iter = 0;
        all_g_iter < results.genres.length;
        all_g_iter++
      ) {
        for (
          let book_g_iter = 0;
          book_g_iter < results.book.genre.length;
          book_g_iter++
        ) {
          if (
            results.genres[all_g_iter]._id.toString() ===
            results.book.genre[book_g_iter]._id.toString()
          ) {
            results.genres[all_g_iter].checked = "true";
          }
        }
      }

      res.render("forms/book_form", {
        title: "Update Book",
        authors: results.authors,
        genres: results.genres,
        book: results.book,
      });
    }
  );
};

// Handle book update on POST
exports.book_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }

    next();
  },

  // Validate and sanitise fields
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // Create a Book object
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.paraller(
        {
          authors: (cb) => {
            Author.find(cb);
          },
          genres: (cb) => {
            Genre.find(cb);
          },
        },
        (err, results) => {
          if (err) return next(err);

          // Mark our selected genres as checked
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }

          res.render("forms/book_form", {
            title: "Update Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );

      return;
    } else {
      Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
        if (err) return next(err);
        res.redirect(thebook.url);
      });
    }
  },
];
