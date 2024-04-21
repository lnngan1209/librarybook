const express = require('express');
const router = express.Router();
const { Sach } = require('../models/models');

router.get('/', async (req, res, next) => {
    try {
        const sachList = await Sach.find();
        res.json(sachList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const sach = await Sach.findById(req.params.id);
        if (!sach) {
            return next(new ApiError(404, 'Sach not found'));
        }
        res.json(sach);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newSach = new Sach(req.body);
        const savedSach = await newSach.save();
        res.status(201).json(savedSach);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedSach = await Sach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSach) {
            return next(new ApiError(404, 'Sach not found'));
        }
        res.json(updatedSach);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedSach = await Sach.findByIdAndDelete(req.params.id);
        if (!deletedSach) {
            return next(new ApiError(404, 'Sach not found'));
        }
        res.json({ message: 'Sach deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
