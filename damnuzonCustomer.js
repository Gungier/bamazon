// ### Challenge #1: Customer View (Minimum Requirement)
// 1. Create a MySQL Database called `bamazon`.
// 2. Then create a Table inside of that database called `products`.
// 3. The products table should have each of the following columns:
//    * item_id (unique id for each product)
//    * product_name (Name of product)
//    * department_name
//    * price (cost to customer)
//    * inventory_count (how much of the product is available in stores)
// 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// 6. The app should then prompt users with two messages.
//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.
// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
// * If this activity took you between 8-10 hours, then you've put enough time into this assignment. Feel free to stop here -- unless you want to take on the next challenge.å

//---------------------------------------------

const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');



const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password123",
  database: "damnuzon_db"
});

//check connection (using con = connecton)
con.connect(function (err) {
  if (err) throw err;
  inStockView();
});

function Item(id, name, price) {
  this.ID = id;
  this.Name = name;
  this.Price = '$' + price;
}

function inStockView() {
  con.query('SELECT * FROM products WHERE product_name IS NOT NULL', (err, res) => {
    if (err) throw err;

    var table = [];

    console.log("\nWelcome to DamnUzon Market Thingy!\n" + "DamnUzon, let's be honest, you'll probably buy it from Amazon...");

    for (var i = 0; i < res.length; i++) {
      table.push(new Item(res[i].item_id, res[i].product_name, res[i].price));

    }

    console.table(table);

    customerInteraction(table);
  });
};

function customerInteraction() {
  inquirer
    .prompt([{
        name: 'id',
        type: 'input',
        message: 'What is the ID of the product you would like to foolishly waste your money on?',
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'How many units will you foolishly buy?',
        validate: (val) => {
          if (val < 1) {
            return false;
          } else {
            return true;
          }
        }
      }
    ])
    .then((res) => {
      inventoryCheck(res.id, res.quantity);
    });
}
// check inventory
function inventoryCheck(id, orderQuantity) {
  con.query('SELECT `product_name`, `inventory_count` FROM products WHERE item_id = "' + id + '"', (err, res) => {
    if (err) throw err;
    var product = res[0].product_name;
    var stockQuantity = res[0].inventory_count;

    if (stockQuantity < orderQuantity) {
      console.log('\nSorry. We currently do not have enough in stock.\n');
      customerInteraction();

    } else {
      console.log('\n========================================\nLast chance to change your mind... but keep in mind, I really need this:\nItem: ' + product + '\nQuantity: ' + orderQuantity + '\nYour order has been placed. No backsies...');
      
      
      buyNow(id, stockQuantity, orderQuantity);

    }
  });
};

function buyNow(id, stockQuantity, orderQuantity) {
  stockQuantity -= orderQuantity;

  // update quantity in stock
  con.query('UPDATE products SET ? WHERE ?',
    [{
        inventory_count: stockQuantity
      },
      {
        item_id: id
      }
    ],
    (err) => {
      if (err) throw err;
      orderSummary(id, orderQuantity);
    });
}

function orderSummary(id, quantity) {
  con.query('SELECT price FROM products WHERE item_id = "' + id + '"', (err, res) => {
    if (err) throw err;

    var price = res[0].price;
    var total = price * quantity;

    console.log('OMG! We are in business!\n========================================\nYou just paid me: $' + price + '(per item)' + '\n--------------------\nThat totals: $' + total.toFixed(2));

    addSale(id, total);
  });
}

// update product sales
function addSale(id, newSale) {
  con.query('SELECT product_sales FROM products WHERE item_id = "' + id + '"', (err, res) => {
    if (err) throw err;

    var currentSale = res[0].product_sales;
    var revenue = currentSale + newSale;

    updateRevenue(id, revenue);
  });
};

// update database
function updateRevenue(id, revenue) {
  con.query('UPDATE products SET ? WHERE ?',
      [{
          product_sales: revenue
        },
        {
          item_id: id
        }
      ],
      (err) => {
        if (err) throw err;
        con.end();
        process.exit();
      }
  )};