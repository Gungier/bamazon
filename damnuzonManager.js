var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// create connection with damnUzon_db database
var con = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password123',
  database: 'damnUzon_db' // insert database name
});

// check if connection made
con.connect((err) => {
  if (err) throw err;
  managerView();
});

function managerView() {
  inquirer
  .prompt([
    {
      name: 'action',
      type: 'list',
      message: 'What do you want to do, manager?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    },
  ])
  .then(function(answer) {
    switch (answer.action) {
      case 'View Products for Sale':
        viewProducts();
      break;
      case 'View Low Inventory':
        lowInventory();
      break;
      case 'Add to Inventory':
        addInventory();
      break;
      case 'Add New Product':
        addProduct();
      break;
    }
  });
}

// list every available item
// constructor for table
function Item(id, name, category, department, price, inventory, sales) {
  this.ID = id;
  this.Name = name;
  this.Category = category;
  this.Department = department;
  this.Price = '$' + price;
  this.Inventory = inventory;
  this.Sales = sales;
}

function viewProducts() {
  con.query('SELECT * FROM products WHERE product_name IS NOT NULL', (err, res) => {
    if (err) throw err;

    var table = [];
    console.log('\n========================================\nList of all available items:\n');

    // run throught table products in database
    for (var i = 0; i < res.length; i++) {
      table.push(new Item(res[i].item_id, res[i].product_name, res[i].price, res[i].category_name, res[i].department_name, res[i].inventory_count)); // add new item to table array
    } 

    console.table(table); // print out the table as table - tablinception

    con.end();
    process.exit();
  });
}

// list all items with inventory count < 5
function lowInventory() {
  con.query('SELECT * FROM products WHERE inventory_count < 5', (err, res) => {
    if (err) throw err;

    var table = [];
    console.log('\n========================================\nList of items with low inventory (< 5):\n');
    
    // run throught table products in database
    for (var i = 0; i < res.length; i++) {
      table.push(new Item(res[i].item_id, res[i].product_name, res[i].price, res[i].category_name, res[i].department_name, res[i].inventory_count)); // add new item to table array
    }

    console.table(table); // print out the table as table - tablinception

    con.end();
    process.exit();
  });
}

// add more of any item currently in the store
function addInventory() {
  con.query('SELECT * FROM products', (err, res) => {
    if (err) throw err;

    var table = [];

    console.log('\n========================================\nList of all the items currently in the store:\n');

    // run throught table products in database
    for (var i = 0; i < res.length; i++) {
      table.push(new Item(res[i].item_id, res[i].product_name, res[i].price, res[i].category_name, res[i].department_name, res[i].inventory_count)); // add new item to table array
    }

    console.table(table); // print out the table as table - tablinception

    chooseItem();
  });
}

// pick item to add
function chooseItem() {
  inquirer
  .prompt([
    {
      name: 'id',
      type: 'input',
      message: 'Enter product ID to increase stock:',
    },
    {
      name: 'quantity',
      type: 'input',
      message: 'Set number of units:',
      // check if user orders nothing
      validate: (val) => {
        if (val < 1) {
          return false;
        }
        else {
          return true;
        }
      }
    }
  ])
  .then((res) => {
     addItem(res.id, res.quantity);
  });
}

function addItem(id, quantity) {
  // update quantity in stock
  con.query('UPDATE products SET ? WHERE ?',
  [
    {
      inventory_count: quantity
    },
    {
      item_id: id
    }
  ],
  (err) => {
    if (err) throw err;
    
    console.log('Inventory has been successfully updated!');

    con.end();
    process.exit();
  });
}

// add a new product to the store
function addProduct() {
  inquirer
  .prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Product name:'
    },
    {
      name: 'department',
      type: 'input',
      message: 'Department name:'
    },
    {
      name: 'price',
      type: 'input',
      message: 'Price:',
      validate: (val) => {
        if (isNaN(val) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: 'quantity',
      type: 'input',
      message: 'Quantity:',
      validate: (val) => {
        if (isNaN(val) === false) {
          return true;
        }
        return false;
      }
    }
  ])
  .then(function(product) {
    con.query('INSERT INTO products SET ?',
      {
        product_name: product.name,
        department_name: product.department,
        price: product.price,
        inventory_count: product.quantity
      },
      function(err) {
        if (err) throw err;

        console.log('The new product has been successfully added to the stock!');

        con.end();
        process.exit();
      }
    );
  });
}