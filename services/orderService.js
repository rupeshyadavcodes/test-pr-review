// services/orderService.js

const { calculateDiscount, calculateTax } = require('../utils/calc');

function createOrder(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Items are required');
  }

  const totalAmount = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const discount = calculateDiscount(totalAmount);
  const amountAfterDiscount = totalAmount - discount;

  const tax = calculateTax(amountAfterDiscount);

  const finalAmount = amountAfterDiscount + tax;

  return {
    totalAmount,
    discount,
    tax,
    finalAmount
  };
}

module.exports = {
  createOrder
};
