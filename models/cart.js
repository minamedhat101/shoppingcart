module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id){
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {item: item, qty: 0, price: 0, totalSubPrice: 0};
    }
    storedItem.qty++;
    storedItem.totalSubPrice = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    storedItem.price =storedItem.item.price;
    this.totalPrice +=storedItem.price;
  };

  this.generateArray = function () {
    var arr = [];
    for (const item in this.items) {
      arr.push(this.items[item]);
    }
    return arr;
  };

};