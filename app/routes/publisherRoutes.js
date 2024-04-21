const express = require('express');
const router = express.Router();
const { publisher } = require('../models/models');
const ApiError = require('../api-error');

router.get('/', async (req, res, next) => {
    try {
        const publisherList = await publisher.find();
        res.json(publisherList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const thispublisher = await publisher.findById(req.params.id);
        if (!thispublisher) {
            return next(new ApiError(404, 'Publisher not found'));
        }
        res.json(thispublisher);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newPublisher = new publisher(req.body);
        const savedPublisher = await newPublisher.save();
        res.status(201).json(savedPublisher);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedPublisher = await publisher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPublisher) {
            return next(new ApiError(404, 'Publisher not found'));
        }
        res.json(updatedPublisher);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedPublisher = await publisher.findByIdAndDelete(req.params.id);
        if (!deletedPublisher) {
            return next(new ApiError(404, 'Publisher not found'));
        }
        res.json({ message: 'Publisher deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
