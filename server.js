const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");
require("dotenv").config();


connectDB();

app.listen(3000, () => {
    console.log("Server listening to port 3000")
})