const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

const rootUnsupportedMethods = ['post', 'put', 'delete', 'patch', 'options', 'head'];
app.all('/', (req, res, next) => {
    if (rootUnsupportedMethods.includes(req.method.toLowerCase())) {
        return next(new ApiError(405, 'Unsupported method'));
    } else {
        next();
    }
});

app.get("/", (req, res)=> {
    res.json({ message: "Welcom to librarybooks-backend" });
});

const docGiaRoutes = require('./app/routes/docGiaRoutes');
const sachRoutes = require('./app/routes/sachRoutes');
const nhaXuatBanRoutes = require('./app/routes/nhaXuatBanRoutes');
const theoDoiMuonSachRoutes = require('./app/routes/theoDoiMuonSachRoutes');
const nhanVienRoutes = require('./app/routes/nhanVienRoutes');

app.use('/api/docgia', docGiaRoutes);
app.use('/api/sach', sachRoutes);
app.use('/api/nhaxuatban', nhaXuatBanRoutes);
app.use('/api/theodoimuonsach', theoDoiMuonSachRoutes);
app.use('/api/nhanvien', nhanVienRoutes);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;