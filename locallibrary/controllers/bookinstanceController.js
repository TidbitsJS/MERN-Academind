const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const async = require("async");

// Display list of all BookInstances
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate("book")
    .exec((err, list_bookinstances) => {
      if (err) {
        return next(err);
      }

      res.render("lists/bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list_bookinstances,
      });
    });
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) return next(err);
      if (bookinstance === null) {
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }

      res.render("details/bookinstance_detail", {
        title: "Copy: " + bookinstance.book.title,
        bookinstance: bookinstance,
      });
    });
};

// Display BookInstance create form on GET
exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, "title").exec((err, books) => {
    if (err) return next(err);

    console.log("Create bookinstance", books);

    res.render("forms/bookinstance_form", {
      title: "Create BookInstance",
      book_list: books,
    });
  });
};

// Handle BookInstance create on POST
exports.bookinstance_create_post = [
  // Validate and sanitise fields
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // Create a bookInstance object
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // Errors. Render form again with sanitized values and error messages
      Book.find({}, "title").exec((err, books) => {
        if (err) return next(err);
        res.render("forms/bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance,
        });
      });

      return;
    } else {
      bookinstance.save((err) => {
        if (err) return next(err);

        res.redirect(bookinstance.url);
      });
    }
  },
];

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) return next(err);
      if (bookinstance === null) res.redirect("/catalog/bookinstances");

      res.render("deletes/bookinstance_delete", {
        title: "Delete BookInstance",
        bookinstance: bookinstance,
      });
    });
};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = (req, res, next) => {
  BookInstance.findByIdAndRemove(req.body.id, (err) => {
    if (err) return next(err);

    res.redirect("/catalog/bookinstances");
  });
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = (req, res, next) => {
  async.parallel(
    {
      bookinstance: (cb) => {
        BookInstance.findById(req.params.id).populate("book").exec(cb);
      },
      books: (cb) => {
        Book.find(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.bookinstance === null) {
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }

      res.render("forms/bookinstance_form.pug", {
        title: "Update Bookinstance",
        book_list: results.books,
        selected_book: results.bookinstance.book._id,
        bookinstance: results.bookinstance,
      });
    }
  );
};

// Hanlde bookinstance update on POST
exports.bookinstance_update_post = [
  // Validate and sanitize fields
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    // Create a BookInstance object
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Book.find({}, "title").exec((err, books) => {
        if (err) return next(err);

        res.render("forms/bookinstance_form", {
          title: "Update BookInstance",
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance: bookinstance,
        });
      });

      return;
    } else {
      BookInstance.findByIdAndUpdate(
        req.params.id,
        bookinstance,
        {},
        (err, thebookinstance) => {
          if (err) return next(err);

          res.redirect(thebookinstance.url);
        }
      );
    }
  },
];
