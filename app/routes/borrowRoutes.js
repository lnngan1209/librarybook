const express = require('express');
const router = express.Router();
const { borrow } = require('../models/models');
const moment = require('moment');

router.get('/', async (req, res, next) => {
    try {
        const followList = await borrow.find();
        const formattedFollowList = followList.map(follow => ({
            ...follow.toJSON(),
            borrow_date: moment(follow.borrow_date).format('DD-MM-YYYY'),
            due_date: moment(follow.due_date).format('DD-MM-YYYY')
        }));
        res.json(formattedFollowList);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const follow = await borrow.findById(req.params.id);
        if (!follow) {
            return next(new ApiError(404, 'Borrow not found'));
        }
        formattedFollow = follow.toJSON();
        formattedFollow['borrow_date'] = moment(follow.borrow_date).format('DD-MM-YYYY');
        formattedFollow['due_date'] = moment(follow.due_date).format('DD-MM-YYYY');
        res.json(formattedFollow);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newFollow = new borrow(req.body);
        const savedFollow = await newFollow.save();
        formattedNewFollow = savedFollow.toJSON();
        formattedNewFollow['borrow_date'] = moment(savedFollow.borrow_date).format('DD-MM-YYYY');
        formattedNewFollow['due_date'] = moment(savedFollow.due_date).format('DD-MM-YYYY');
        res.status(201).json(formattedNewFollow);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedFollow = await borrow.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFollow) {
            return next(new ApiError(404, 'Borrow not found'));
        }
        formattedUpdatedFollow = updatedFollow.toJSON();
        formattedUpdatedFollow['borrow_date'] = moment(updatedFollow.borrow_date).format('DD-MM-YYYY');
        formattedUpdatedFollow['due_date'] = moment(updatedFollow.due_date).format('DD-MM-YYYY');
        res.json(formattedUpdatedFollow);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedFollow = await borrow.findByIdAndDelete(req.params.id);
        if (!deletedFollow) {
            return next(new ApiError(404, 'Borrow not found'));
        }
        res.json({ message: 'Borrow deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
