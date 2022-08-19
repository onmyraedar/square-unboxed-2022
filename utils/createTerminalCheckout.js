const { ApiError } = require("square");
const crypto = require("crypto");

async function createTerminalCheckout(client, order) {
  const amountMoney = order.netAmountDueMoney;
  const orderId = order.id;
    
  try {
      const createCheckoutResponse = await client.terminalApi.createTerminalCheckout({
        idempotencyKey: crypto.randomUUID(),
        checkout: {
          amountMoney: amountMoney,
          orderId: orderId,
          deviceOptions: {
            deviceId: "9fa747a2-25ff-48ee-b078-04381f7c828f"
          }
        }
      });
      const checkout = createCheckoutResponse.result;
      return checkout;
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

module.exports = ("createTerminalCheckout", createTerminalCheckout);