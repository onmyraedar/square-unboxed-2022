const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const { Client, Environment } = require("square");

const listCatalog = require("./utils/listCatalog");
const toObject = require("./utils/toObject");

const CatalogItem = require("./models/catalogitem");
const InventoryItem = require("./models/inventoryitem");

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const client = new Client({
    accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
    environment: Environment.Sandbox,
});

const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://bento1729:Km4Y5ehh7wMhVQ5y@cluster0.ta6pr.mongodb.net/bento_unboxed_inventory?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Get static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
    return res.json("Hello world!");
});

app.get("/message", (req, res) => {
    console.log("Message sent!");
    return res.json("Don't have a good day, have a great day.");
});

app.get("/catalog/import", async (req, res) => {
    const catalogObjects = await listCatalog(client, "ITEM,MODIFIER_LIST");
    
    // The toObject function resolves an issue where .json cannot serialize BigInts
    return res.json(catalogObjects.map((catalogObject) => toObject(catalogObject)));
});

app.get("/inventory/import", (req, res) => {
    InventoryItem.find()
        .sort([["name", "ascending"]])
        .exec(function (error, list_items) {
            if (error) { return next(error); }
            return res.json(list_items);
        })
});

app.post("/inventoryitem/create", (req, res) => {
    console.log("Logging works");
    const inventoryItem = new InventoryItem(
        {
            name: req.body.name,
            quantity_in_stock: req.body.quantity_in_stock,
            unit: req.body.unit
        }
    );
    inventoryItem.save(function (error) {
        if (error) {
            console.log("There was an error. :(");
            return next(error);
        } else {
            console.log("There was no error! :)");
        }
        return res.json(inventoryItem);
    })
});

app.get("/catalogitem/find/:catalogObjectID", (req, res) => {
    console.log("we got to the backend!");
    console.log(req.params.catalogObjectID);
    CatalogItem.findOne({
        catalog_object_id: req.params.catalogObjectID
    })
    .exec(function (error, catalog_item) {
        if (error) { return next(error); }
        console.log(catalog_item);
        return res.json(catalog_item);
    })
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
