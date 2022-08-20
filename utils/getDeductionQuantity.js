function getDeductionQuantity(quantityInStockDecimal, recipeQuantityDecimal) {
  // The parser is needed because both quantities are in Decimal128 format
  const quantityInStock = parseFloat(quantityInStockDecimal.toString());
  const recipeQuantity = parseFloat(recipeQuantityDecimal.toString());
  let deductionQuantity;
  if (quantityInStock < recipeQuantity) {
    deductionQuantity = quantityInStock;
  } else {
    deductionQuantity = recipeQuantity;
  }
  return deductionQuantity;
}

module.exports = ("getDeductionQuantity", getDeductionQuantity);