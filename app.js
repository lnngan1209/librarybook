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

const readerRoutes = require('./app/routes/readerRoutes');
const bookRoutes = require('./app/routes/bookRoutes');
const publisherRoutes = require('./app/routes/publisherRoutes');
const borrowRoutes = require('./app/routes/borrowRoutes');
const staffRoutes = require('./app/routes/staffRoutes');

app.use('/api/reader', readerRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/publisher', publisherRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/staff', staffRoutes);

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;