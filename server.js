const app = require("./app");
const config = require("./app/config");
const mongoose = require("mongoose");

//start server
async function startServer() {
    try {
        await mongoose.connect(config.db.uri);
        console.log(`Connect to MongoDB at ${config.db.uri}.`);

        const PORT = config.app.port;
        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.log(`Can't connect to the database at ${config.db.uri}. `, error);
        process.exit();
    }
}

startServer();