const express = require('express');
const router = express.Router();
const { TheoDoiMuonSach } = require('../models/models');
const moment = require('moment');

router.get('/', async (req, res, next) => {
    try {
        const theoDoiList = await TheoDoiMuonSach.find();
        const formattedTheoDoiList = theoDoiList.map(theoDoi => ({
            ...theoDoi.toJSON(),
            NgayMuon: moment(theoDoi.NgayMuon).format('DD-MM-YYYY'),
            NgayTra: moment(theoDoi.NgayTra).format('DD-MM-YYYY')
        }));
        res.json(formattedTheoDoiList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const theoDoi = await TheoDoiMuonSach.findById(req.params.id);
        if (!theoDoi) {
            return next(new ApiError(404, 'TheoDoiMuonSach not found'));
        }
        formattedTheoDoi = theoDoi.toJSON();
        formattedTheoDoi['NgayMuon'] = moment(theoDoi.NgayMuon).format('DD-MM-YYYY');
        formattedTheoDoi['NgayTra'] = moment(theoDoi.NgayTra).format('DD-MM-YYYY');
        res.json(formattedTheoDoi);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newTheoDoi = new TheoDoiMuonSach(req.body);
        const savedTheoDoi = await newTheoDoi.save();
        formattedNewTheoDoi = savedTheoDoi.toJSON();
        formattedNewTheoDoi['NgayMuon'] = moment(savedTheoDoi.NgayMuon).format('DD-MM-YYYY');
        formattedNewTheoDoi['NgayTra'] = moment(savedTheoDoi.NgayTra).format('DD-MM-YYYY');
        res.status(201).json(formattedNewTheoDoi);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedTheoDoi = await TheoDoiMuonSach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTheoDoi) {
            return next(new ApiError(404, 'TheoDoiMuonSach not found'));
        }
        formattedUpdatedTheoDoi = updatedTheoDoi.toJSON();
        formattedUpdatedTheoDoi['NgayMuon'] = moment(updatedTheoDoi.NgayMuon).format('DD-MM-YYYY');
        formattedUpdatedTheoDoi['NgayTra'] = moment(updatedTheoDoi.NgayTra).format('DD-MM-YYYY');
        res.json(formattedUpdatedTheoDoi);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedTheoDoi = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
        if (!deletedTheoDoi) {
            return next(new ApiError(404, 'TheoDoiMuonSach not found'));
        }
        res.json({ message: 'TheoDoiMuonSach deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
