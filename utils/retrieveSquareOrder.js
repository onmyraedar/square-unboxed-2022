const { ApiError } = require("square");

async function retrieveSquareOrder(client, orderId) {
    try {
        const retrieveOrderResponse = await client.ordersApi.retrieveOrder(orderId);
        const orderDetails = retrieveOrderResponse.result.order;
        return orderDetails;
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

module.exports = ("retrieveSquareOrder", retrieveSquareOrder);