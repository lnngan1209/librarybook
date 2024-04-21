const express = require('express');
const router = express.Router();
const { staff } = require('../models/models');

// GET - Lấy tất cả nhân viên
router.get('/', async (req, res, next) => {
    try {
        const staffList = await staff.find();
        res.json(staffList);
    } catch (err) {
        next(err);
    }
});

// GET - Lấy nhân viên bằng ID
router.get('/:id', async (req, res, next) => {
    try {
        const staff = await staff.findById(req.params.id);
        if (!staff) {
            return next(new ApiError(404, 'Staff not found'));
        }
        res.json(staff);
    } catch (err) {
        next(err);
    }
});

// POST - Tạo mới một nhân viên
router.post('/', async (req, res, next) => {
    try {
        const newStaff = new staff(req.body);
        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (err) {
        next(err);
    }
});

// PUT - Cập nhật thông tin nhân viên
router.put('/:id', async (req, res, next) => {
    try {
        const updatedStaff = await staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStaff) {
            return next(new ApiError(404, 'Staff not found'));
        }
        res.json(updatedStaff);
    } catch (err) {
        next(err);
    }
});

// DELETE - Xóa nhân viên
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedStaff = await staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            return next(new ApiError(404, 'Staff not found'));
        }
        res.json({ message: 'Staff deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;