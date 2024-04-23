const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
    name: String,
    birthday: Date,
    gender: String,
    address: String,
    phone: String
});

const bookSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    publication_year: Number,
    publisher_id: String,
});

const publisherSchema = new mongoose.Schema({
    name: String,
    address: String
});

const borrowSchema = new mongoose.Schema({
    reader_id: { type: String, required: true },
    book_id: { type: String, required: true },
    borrow_date: Date,
    due_date: Date,
    status: Boolean
});

const staffSchema = new mongoose.Schema({
    name: String,
    Password: String,
    position: String,
    address: String,
    phone: String
});

const reader = mongoose.model('Reader', readerSchema);
const book = mongoose.model('Book', bookSchema);
const publisher = mongoose.model('Publisher', publisherSchema);
const borrow = mongoose.model('Borrow', borrowSchema);
const staff = mongoose.model('Staff', staffSchema);

module.exports = { reader, book, publisher, borrow, staff };
