const { ApiError } = require("square");
const crypto = require("crypto");

async function createSquareOrder(client, formattedLineItems) {
    try {
        const createOrderResponse = await client.ordersApi.createOrder({
          order: {
            /* My seller location ID, hard-coded for testing */
            locationId: "LV1XCS4GAT0V3",
            lineItems: formattedLineItems,
            idempotencyKey: crypto.randomUUID(),
          }
        });
        const order = createOrderResponse.result.order;
        return order;
    } catch (error) {
        if (error instanceof ApiError) {
            error.result.errors.forEach(function (e) {
                console.log(e.category);
                console.log(e.code);
                console.log(e.detail);
            }); 
        } else {
            console.log("Unexpected error occurred: ", error);
        }        
    }
}

module.exports = ("createSquareOrder", createSquareOrder);