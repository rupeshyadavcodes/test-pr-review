// utils/calc.js

function calculateDiscount(totalAmount) {
  // 10% discount if order > 1000
  if (totalAmount > 1000) {
    return totalAmount * 0.10;
  }
  return 0;
}

function calculateTax(amountAfterDiscount) {
  const TAX_RATE = 0.18; // 18% GST
  return amountAfterDiscount * TAX_RATE;
}

module.exports = {
  calculateDiscount,
  calculateTax
};
