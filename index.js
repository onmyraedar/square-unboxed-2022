const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    return res.send("Hello world!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => 
    console.log(`Listening on port ${port}`)
);
