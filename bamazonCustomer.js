var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "127.0.0.1",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Now connected as " + connection.threadId + "\n");
  begin();
});

function begin() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "welcome",
        message:
          "Hello! Welcome to Bamazon!\nWould you like to see our categories?",
        default: true
      }
    ])
    .then(function(user) {
      if (user.welcome === true) {
        showCategories();
      } else {
        connection.end();
      }
    });
}

function showCategories() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var categoryArray = [];
            for (let i = 0; i < res.length; i++) {
              var catName = res[i].department_name;
              //console.log(catName);
              if (categoryArray.includes(catName) === false) {
                categoryArray.push(catName);
              }
            }
            return categoryArray;
          },
          message: "Which category would you like to explore?"
        }
      ])
      .then(function(answer) {
        var categoryTable = new Table({
          head: ["ID", "Product", "Category", "Price", "Stock"],
          colWidths: [10, 45, 45, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {
          var productID = res[i].item_id,
            productName = res[i].product_name,
            categoryName = res[i].department_name,
            price = "$ " + res[i].price,
            stock = res[i].stock_quantity;

          if (res[i].department_name === answer.choice) {
            categoryTable.push([
              productID,
              productName,
              categoryName,
              price,
              stock
            ]);
          }
        }

        console.log(
          "\n" +
            "====================================================== Current Category Inventory ======================================================\n" +
            categoryTable.toString() +
            "\n"
        );
      });
  });
}
