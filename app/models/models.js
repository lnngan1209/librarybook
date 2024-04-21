const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    HoLot: String,
    Ten: String,
    NgaySinh: Date,
    Phai: String,
    DiaChi: String,
    DienThoai: String
});

const sachSchema = new mongoose.Schema({
    TenSach: String,
    DonGia: Number,
    SoQuyen: Number,
    NamXuatBan: Number,
    MaNXB: String,
    NguonGoc: String
});

const nhaXuatBanSchema = new mongoose.Schema({
    TenNXB: String,
    DiaChi: String
});

const theoDoiMuonSachSchema = new mongoose.Schema({
    MaDocGia: { type: String, required: true },
    MaSach: { type: String, required: true },
    NgayMuon: Date,
    NgayTra: Date
});

const nhanVienSchema = new mongoose.Schema({
    HoTenNV: String,
    Password: String,
    ChucVu: String,
    DiaChi: String,
    SoDienThoai: String
});

const DocGia = mongoose.model('DocGia', docGiaSchema);
const Sach = mongoose.model('Sach', sachSchema);
const NhaXuatBan = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', theoDoiMuonSachSchema);
const NhanVien = mongoose.model('NhanVien', nhanVienSchema);

module.exports = { DocGia, Sach, NhaXuatBan, TheoDoiMuonSach, NhanVien };
