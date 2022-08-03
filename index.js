const cors = require("cors");
const express = require("express");
const path = require("path");

const app = express();

app.use(cors());

// Get static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
    return res.json("Hello world!");
});

app.get("/message", (req, res) => {
    return res.json("Don't have a good day, have a great day.");
});

app.post("/webhook", (req, res) => {
    const event = req.body;
    console.log(event);
    res.sendStatus(200);
});

// Send back index.html for any request
// that does not match the above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => 
    console.log(`Listening on port ${port}`)
);
