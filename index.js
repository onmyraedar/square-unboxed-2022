const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const { Client, Environment } = require("square");

const createCatalogItem = require("./utils/createCatalogItem");
const createCatalogItemVariation = require("./utils/createCatalogItemVariation");
const createOrder = require("./utils/createOrder");
const createSquareOrder = require("./utils/createSquareOrder");
const createTerminalCheckout = require("./utils/createTerminalCheckout");
const formatOrderLineItems = require("./utils/formatOrderLineItems");
const getDeductionQuantity = require("./utils/getDeductionQuantity");
const listCatalog = require("./utils/listCatalog");
const retrieveSquareOrder = require("./utils/retrieveSquareOrder");
const toObject = require("./utils/toObject");

const CatalogItem = require("./models/catalogitem");
const CatalogItemVariation = require("./models/catalogitemvariation");
const InventoryItem = require("./models/inventoryitem");
const InventoryItemChange = require("./models/inventoryitemchange");
const Order = require("./models/order");

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

app.get("/inventory/import", (req, res, next) => {
    InventoryItem.find()
        .sort([["name", "ascending"]])
        .exec(function (error, list_items) {
            if (error) { return next(error); }
            return res.json(list_items);
        })
});

app.post("/recipeset/create", (req, res) => {

    const variations = [];
    const variationdetails = req.body.variations;
    for (const variationdetail of variationdetails) {
        const variation = createCatalogItemVariation(variationdetail);
        variations.push(variation);
    }

    const catalogItem = createCatalogItem(req.body, variations);
    
    return res.json("Recipe successfully saved");
});

app.post("/recipeset/update", async (req, res) => {
    
    const catalogItem = await CatalogItem.findById(req.body._id);
    catalogItem.modifier_lists = req.body.modifier_lists;
    await catalogItem.save();

    for (const variation of req.body.variations) {
        const catalogItemVariation = await CatalogItemVariation.findById(variation._id);
        catalogItemVariation.recipe = variation.recipe;
        await catalogItemVariation.save();
    }

    return res.json("Recipe updates successfully saved");

});

app.post("/recipeset/delete", async (req, res) => {

    console.log(req.body);

    for (const variation of req.body.variations) {
        const variationQueryRes = await CatalogItemVariation.findByIdAndDelete(variation._id);
    }
    
    const itemQueryRes = await CatalogItem.findByIdAndDelete(req.body._id);

    return res.json("Recipe deletion successful");

});

app.post("/inventoryitem/create", (req, res, next) => {
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
    });
});

app.post("/inventoryitem/update", async (req, res) => {
    const inventoryItem = await InventoryItem.findById(req.body._id)

    inventoryItem.name = req.body.name;
    inventoryItem.unit = req.body.unit;

    await inventoryItem.save();

    return res.json("Inventory item updates successfully saved");

});

app.post("/inventoryitemchange/create", async (req, res) => {
    
    console.log(req.body);

    let deductionQuantity;
    if (req.body.type === "ADDITION") {
        deductionQuantity = req.body.quantity_change;
    } else if (req.body.type === "DEDUCTION") {
        deductionQuantity = -req.body.quantity_change;
    }

    const quantityBefore = 
        parseFloat(req.body.inventory_item.quantity_in_stock["$numberDecimal"]);
    const quantityAfter = 
        parseFloat(req.body.inventory_item.quantity_in_stock["$numberDecimal"]) +
        parseFloat(deductionQuantity);

    const inventoryItemChange = new InventoryItemChange({
        type: req.body.type,
        inventory_item: req.body.inventory_item._id,
        reason: req.body.reason,
        quantity: req.body.quantity_change,
        quantity_in_stock: {
            before: quantityBefore,
            after: quantityAfter,
        },
      });    

    inventoryItemChange.save(function (error) {
    if (error) {
        console.log(error);
        console.log("There was an error");
    } else {
        console.log("There was no error");
    }
    });   

    console.log(inventoryItemChange);

    const inventoryItem = await InventoryItem.findByIdAndUpdate(
        req.body.inventory_item._id, { $inc: { quantity_in_stock: deductionQuantity } }
      )

    return res.json("Inventory item updates successfully saved");

});

app.get("/inventoryitemchange/findbyinventoryitem/:itemID", (req, res, next) => {
    InventoryItemChange.find({ inventory_item: req.params.itemID })
        .sort({_id: -1})
        .exec(function (error, list_changes) {
            if (error) { return next(error); }
            return res.json(list_changes);
        })
});

app.get("/catalogitem/all", (req, res, next) => {
    CatalogItem.find()
        .sort([["name", "ascending"]])
        .exec(function (error, list_items) {
            if (error) { return next(error); }
            return res.json(list_items);
        })
});

app.get("/catalogitem/findbyid/:itemID", (req, res, next) => {
    CatalogItem.findById(req.params.itemID)
    .populate({path: "variations",
      populate: { path: "recipe.ingredient" }
    })
    .populate("modifier_lists.modifiers.recipe.ingredient")
    .exec(function (error, catalog_item) {
        if (error) { return next(error); }
        console.log(catalog_item);
        return res.json(catalog_item);
    })
});

app.get("/catalogitem/find/:catalogObjectID", (req, res, next) => {
    CatalogItem.findOne({
        catalog_object_id: req.params.catalogObjectID
    })
    .exec(function (error, catalog_item) {
        if (error) { return next(error); }
        console.log(catalog_item);
        return res.json(catalog_item);
    })
});

app.get("/order/deductions", async (req, res, next) => {
    const squareOrderDetails = await retrieveSquareOrder(client, "hYDLCM0aSqa9RCcGit2egI2ouaB");
    const order = createOrder(squareOrderDetails);
});

app.get("/order/all", (req, res, next) => {
    Order.find()
        .sort({_id: -1})
        .populate({path: "line_items.inventory_item_changes",
            populate: { path: "inventory_item" }
        })      
        .exec(function (error, list_orders) {
            if (error) { return next(error); }
            return res.json(list_orders);
        })
});

app.post("/order/create/test", async (req, res, next) => {
    const lineItems = req.body.lineItems;
    const formattedLineItems = formatOrderLineItems(lineItems);
    const order = await createSquareOrder(client, formattedLineItems);
    const terminalCheckout = await createTerminalCheckout(client, order);
    console.log(terminalCheckout);
    return res.json("Success");
  });

app.post("/webhook", async (req, res, next) => {
    const event = req.body;
    console.log(event);

    res.sendStatus(200);

    switch(event.type) {

       case "terminal.checkout.updated":
           const paymentStatus = event.data.object.checkout.status;
           if (paymentStatus === "COMPLETED") {

                const orderId = event.data.object.checkout.order_id;

                console.log(`Order ID: ${orderId}`);

                const squareOrderDetails = await retrieveSquareOrder(client, orderId);

                console.log(`Square order ID: ${squareOrderDetails.id}`);

                const order = await createOrder(squareOrderDetails);

                console.log("Order details below", order);
             
           }
    
       default:
        // do nothing

    }

});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Sorry, something went wrong.");
  })

// Send back index.html for any request
// that does not match the above
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => 
    console.log(`Listening on port ${port}`)
);
