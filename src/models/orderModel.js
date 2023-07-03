const Order = function (order) {
  (this.userId = order.userId), (this.created_at = order.created_at);
};

module.exports = Order;
