const Receipt = function (receipt) {
  (this.receiptCode = receipt.receiptCode),
    (this.userId = receipt.userId),
    (this.paymentId = receipt.paymentId),
    (this.totalPrice = receipt.totalPrice),
    (this.receiptName = receipt.receiptName),
    (this.description = receipt.description),
    (this.created_at = receipt.created_at),
    (this.updated_at = receipt.updated_at);
};

module.exports = Receipt;
