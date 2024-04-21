const express = require('express');
const router = express.Router();
const { DocGia } = require('../models/models');
const moment = require('moment');

router.get('/', async (req, res, next) => {
    try {
        const docGiaList = await DocGia.find();
        const formattedDocGiaList = docGiaList.map(docGia => ({
            ...docGia.toJSON(),
            NgaySinh: moment(docGia.NgaySinh).format('DD-MM-YYYY')
        }));
        res.json(formattedDocGiaList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const docGia = await DocGia.findById(req.params.id);
        if (!docGia) {
            return next(new ApiError(404, 'DocGia not found'));
        }
        formattedDocGia = docGia.toJSON();
        formattedDocGia['NgaySinh']=moment(docGia.NgaySinh).format('DD-MM-YYYY');
        res.json(formattedDocGia);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newDocGia = new DocGia(req.body);
        const savedDocGia = await newDocGia.save();
        formattedNewDocGia = savedDocGia.toJSON();
        formattedNewDocGia['NgaySinh']=moment(savedDocGia.NgaySinh).format('DD-MM-YYYY');
        res.status(201).json(formattedNewDocGia);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedDocGia = await DocGia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDocGia) {
            return next(new ApiError(404, 'DocGia not found'));
        }
        formattedUpdatedDocGia=updatedDocGia.toJSON();
        formattedUpdatedDocGia['NgaySinh']=moment(savedDocGia.NgaySinh).format('DD-MM-YYYY');
        res.json(formattedUpdatedDocGia);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedDocGia = await DocGia.findByIdAndDelete(req.params.id);
        if (!deletedDocGia) {
            return next(new ApiError(404, 'DocGia not found'));
        }
        res.json({ message: 'DocGia deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
