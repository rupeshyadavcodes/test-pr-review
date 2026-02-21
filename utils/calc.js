// utils/calc.js

function calculateDiscount(totalAmount) {
  if (totalAmount >= 100) {
    return totalAmount * 0.10;
  }
  return 0;
}

function calculateTax(totalAmount) {
  const TAX_RATE = 0.18;
  return totalAmount * TAX_RATE;
}

module.exports = {
  calculateDiscount,
  calculateTax
};
