require("dotenv").config();
const app = require("express")();
const router = require("./routes/routes");
const port = process.env.PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

app.use(
    cors({
        origin: ["https://artisan-flix-client.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use(router).listen(port, () => console.log(`Listening to port ${port}`));

mongoose
    .connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB Atlas!");
    })
    .catch((err) => {
        console.log("Error Connection", err);
    });
