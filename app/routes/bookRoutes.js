const express = require('express');
const router = express.Router();
const { book } = require('../models/models');

router.get('/', async (req, res, next) => {
    try {
        const bookList = await book.find();
        res.json(bookList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const thisbook = await book.findById(req.params.id);
        if (!thisbook) {
            return next(new ApiError(404, 'Book not found'));
        }
        res.json(thisbook);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newBook = new book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedBook = await book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            return next(new ApiError(404, 'Book not found'));
        }
        res.json(updatedBook);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedBook = await book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return next(new ApiError(404, 'Book not found'));
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
