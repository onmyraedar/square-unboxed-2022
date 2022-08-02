const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    return res.json("Hello world!");
});

app.get("/message", (req, res) => {
    return res.json("Don't have a good day, have a great day.");
});

const port = process.env.PORT || 5000;
app.listen(port, () => 
    console.log(`Listening on port ${port}`)
);
