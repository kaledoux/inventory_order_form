var inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      document.querySelector('#order_date').innerText = (date.toUTCString());
    },
    cacheTemplate: function() {
      var iTmpl = document.querySelector('#addItemTemplate');
      this.template = iTmpl.innerHTML;
      iTmpl.remove();
    },
    add: function() {
      this.lastId++;
      var item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item);

      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      var found_item;

      this.collection.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false;
        }
      });

      return found_item;
    },
    update: function(div) {
      var id = this.findID(div),
          item = this.get(id);

      item.name = div.querySelector("[name^=item_name]").value;
      item.stock_number = div.querySelector("[name^=item_stock_number]").value;
      item.quantity = div.querySelector("[name^=item_quantity]").value;
    },
    newItem: function(e) {
      e.preventDefault();
      var item = this.add();
          //get html template
          let template = this.template;
          // build context object for handlebars function
          let id = item.id;
          let context = {"itemID": id, "itemName": `item_name_${id}`,
                         "itemStockNumber": `item_stock_number_${id}`,
                         "itemQuantity": `item_quantity_${id}`};

          // call the function
          let templateScript = Handlebars.compile(template);
          let html = templateScript(context);

          // insert html
          let newItem = document.createElement('div');
          newItem.setAttribute('id', `newItem${id}`);
          newItem.innerHTML = html;

          document.querySelector('#inventory').appendChild(newItem);

    },
    findParent: function(e) {
      return e.target.parentNode;
    },
    findID: function(item) {
      return +item.querySelector("input[type=hidden]").value;

    },

    deleteItem: function(e) {
      e.preventDefault();
      var item = this.findParent(e)
      this.findParent(e).remove();

      this.remove(this.findID(item));
    },

    updateItem: function(e) {
      var item = this.findParent(e);

      this.update(item);
    },
    bindEvents: function() {
      document.querySelector('#add_item')
              .addEventListener('click', this.newItem.bind(this)
      );

      document.querySelector('#inventory')
              .addEventListener('click', (e) => {
                let t = e.target;
                if (t.nodeName === 'A' && t.classList.contains('delete')) {
                  let delFun = this.deleteItem.bind(this);
                  delFun(e);
                } else {
                  return;
                }
              });

      document.querySelector('#inventory')
              .addEventListener('blur', (e) => {
                if (t.nodeName === 'INPUT') {
                  let updateFun = this.updateItem.bind(this);
                  updateFun(e);
                }
              });
    },

    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

document.addEventListener('DOMContentLoaded', function(e) {
  let inititializeInventory = inventory.init.bind(inventory);
  inititializeInventory();
});
