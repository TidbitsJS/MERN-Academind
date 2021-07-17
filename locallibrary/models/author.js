const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  console.log("Calling virtual", this.family_name, this.first_name);
  return this.family_name + " " + this.first_name;
});

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  let lifetime_string = "";

  if (this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    );
  }

  lifetime_string += " ";

  if (this.date_of_death) {
    lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(
      DateTime.DATE_MED
    );
  }

  return lifetime_string;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Virtual for author's date_of_birth formatting
AuthorSchema.virtual("dob_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "Unknown";
});

// Virtual for author's date_of_death formatting
AuthorSchema.virtual("dod_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "Unknown";
});

// Virtual for author's date_of_date update form
AuthorSchema.virtual("dob_updateForm").get(function () {
  // format 'YYYY-MM-DD'
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

// Virtual for author's date_of_death update form
AuthorSchema.virtual("dod_updateForm").get(function () {
  // format 'YYYY-MM-DD'
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

module.exports = mongoose.model("Author", AuthorSchema);
