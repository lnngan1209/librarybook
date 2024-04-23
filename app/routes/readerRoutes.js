const express = require('express');
const router = express.Router();
const { reader } = require('../models/models');
const moment = require('moment');

router.get('/', async (req, res, next) => {
    try {
        const readerList = await reader.find();
        const formattedReaderList = readerList.map(reader => ({
            ...reader.toJSON(),
            birthday: moment(reader.birthday).format('DD-MM-YYYY')
        }));
        res.json(formattedReaderList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const thisreader = await reader.findById(req.params.id);
        if (!thisreader) {
            return next(new ApiError(404, 'Reader not found'));
        }
        formattedReader = thisreader.toJSON();
        formattedReader['birthday']=moment(thisreader.birthday).format('DD-MM-YYYY');
        res.json(formattedReader);
        res.json(thisreader);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newReader = new reader(req.body);
        const savedReader = await newReader.save();
        formattedNewReader = savedReader.toJSON();
        formattedNewReader['birthday']=moment(savedReader.birthday).format('DD-MM-YYYY');
        res.status(201).json(formattedNewReader);
        res.status(201).json(savedReader);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedReader = await Reader.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReader) {
            return next(new ApiError(404, 'Reader not found'));
        }
        formattedUpdatedReader=updatedReader.toJSON();
        formattedUpdatedReader['birthday']=moment(savedReader.birthday).format('DD-MM-YYYY');
        res.json(formattedUpdatedReader);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedReader = await reader.findByIdAndDelete(req.params.id);
        if (!deletedReader) {
            return next(new ApiError(404, 'Reader not found'));
        }
        res.json({ message: 'Reader deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
