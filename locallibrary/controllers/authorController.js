const Author = require("../models/author");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Authors
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([["family_name", "ascending"]])
    .exec((err, list_authors) => {
      if (err) {
        return next(err);
      }

      res.render("lists/author_list", {
        title: "Author List",
        author_list: list_authors,
      });
    });
};

// Display detail page for a specific Author
exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author: (cb) => {
        Author.findById(req.params.id).exec(cb);
      },

      author_books: (cb) => {
        Book.find({ author: req.params.id }, "title summary").exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author === null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }

      res.render("details/author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

// Display Author create form on GET
exports.author_create_get = (req, res) => {
  res.render("forms/author_form", { title: "Create Author" });
};

// Handle Author create on POST
exports.author_create_post = [
  // Validate and sanitize fields
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),

  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),

  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Sanitized errors messages
      res.render("forms/author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Check if author with same name already exists
      Author.findOne({
        first_name: { $regex: "^" + req.body.first_name + "$", $options: "i" },
        family_name: {
          $regex: "^" + req.body.family_name + "$",
          $options: "i",
        },
      }).exec((err, found_author) => {
        if (err) return next(err);

        // Author exists
        if (found_author) res.redirect(found_author.url);
        else {
          // Create author object
          const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
          });

          author.save(function (err) {
            if (err) return next(err);
            res.redirect(author.url);
          });
        }
      });
    }
  },
];

// Display Author delete form on GET
exports.author_delete_get = (req, res, next) => {
  async.parallel(
    {
      author: (cb) => {
        Author.findById(req.params.id).exec(cb);
      },
      author_books: (cb) => {
        Book.find({ author: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author === null) res.redirect("/catalog/authors");

      res.render("deletes/author_delete", {
        title: "Delete Author",
        author: results.author,
        author_books: results.author_books,
      });
    }
  );
};

// Handle Author delete on POST
exports.author_delete_post = (req, res, next) => {
  async.parallel(
    {
      author: (cb) => {
        Author.findById(req.body.authorid).exec(cb);
      },
      author_books: (cb) => {
        Book.find({ author: req.body.authorid }).exec(cb);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author_books.length > 0) {
        // Author has books
        res.render("deletes/author_delete", {
          title: "Delete Author",
          author: results.author,
          author_books: results.author_books,
        });
      } else {
        // Author has no books. Delete object and redirect
        Author.findByIdAndRemove(req.body.authorid, (err) => {
          if (err) return next(err);

          res.redirect("/catalog/authors");
        });
      }
    }
  );
};

// Display Author update form on GET
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Auhtor update POST");
};
