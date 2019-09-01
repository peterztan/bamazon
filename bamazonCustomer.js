var log = require("single-line-log").stdout;
var mysql = require("mysql");
var Table = require("cli-table");
var inquirer = require("inquirer");
var Timer = require("tiny-timer");
var divider = "===================================================";

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

        buyConfirm();
      });
  });
}

function buyConfirm() {
  inquirer
    .prompt([
      {
        name: "buy",
        type: "confirm",
        message: "Would you like to buy an item?",
        default: true
      }
    ])
    .then(function(user) {
      if (user.buy === true) {
        buyAction();
      } else {
        waitAction();
      }
    });
}

function buyAction() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message:
          "Which item would you like to buy?\nPlease refer to the shown category table for item ID number and enter the desired number below.\n"
      },
      {
        name: "amount",
        type: "input",
        message: "How many woukd you like to buy?\n"
      }
    ])
    .then(function(userSelect) {
      connection.query(
        "SELECT * FROM products WHERE item_id=?",
        userSelect.id,
        function(err, res) {
          if (err) throw err;

          for (let i = 0; i < res.length; i++) {
            if (userSelect.amount > res[i].stock_quantity) {
              console.log(
                divider +
                  "\nWe sincerely apologize! We do not have enough of this specific item in stock. Please check with us at a later date.\n" +
                  divider
              );
              waitAction();
            } else {
              var categoryTable = new Table({
                head: ["Product", "Category", "Price", "Quantity", "Total"],
                colWidths: [45, 45, 10, 10, 20]
              });

              var productName = res[i].product_name,
                categoryName = res[i].department_name,
                price = "$ " + res[i].price,
                buyQuantity = userSelect.amount;
              buyTotal = (res[i].price * userSelect.amount).toFixed(2);
              payTotal = "$ " + buyTotal;

              categoryTable.push([
                productName,
                categoryName,
                price,
                buyQuantity,
                payTotal
              ]);

              console.log(
                divider +
                  "\nThank you, this product is currently in stock!\n" +
                  divider +
                  "\nYou have selected the following item(s):\n" +
                  categoryTable.toString() +
                  "\n" +
                  divider
              );

              var newStock = res[i].stock_quantity - userSelect.amount;
              var buyID = userSelect.id;

              checkPurchase(
                productName,
                buyQuantity,
                payTotal,
                newStock,
                buyID
              );
            }
          }
        }
      );
    });
}

function checkPurchase(productName, buyQuantity, payTotal, newStock, buyID) {
  inquirer
    .prompt([
      {
        name: "buyConfirm",
        type: "confirm",
        message:
          "Are you sure you would like to purchase " +
          buyQuantity +
          " " +
          productName +
          " for " +
          payTotal +
          " ?",
        default: true
      }
    ])
    .then(function(confirmation) {
      if (confirmation.buyConfirm === true) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newStock
            },
            {
              item_id: buyID
            }
          ],
          function(err, res) {
            if (err) throw err;
          }
        );

        console.log(
          divider +
            "\nTransaction Successful! Thank you for your business!\n" +
            divider
        );
        waitAction();
      } else {
        console.log(
          divider +
            "\nThat's OK! You don't have to decide right at this moment.\n" +
            divider
        );
        waitAction();
      }
    });
}

function waitAction() {
  inquirer
    .prompt([
      {
        name: "confirm",
        type: "confirm",
        message: "Would you like to go back to category menu?",
        default: true
      }
    ])
    .then(function(user) {
      if (user.confirm === true) {
        showCategories();
      } else {
        interSection();
      }
    });
}

function countDown() {
  var timer = new Timer({ interval: 1000, stopwatch: false });
  var counter = 30;

  timer.on("tick", ms => {
    counter--, log(counter);
  });
  timer.on("done", () => {
    console.log("\nTime's Up!"), waitAction();
  });
  timer.on("statusChanged", status => console.log("\nCountdown:", status));

  timer.start(30000);
}

function interSection() {
  inquirer
    .prompt([
      {
        name: "interSection",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
          "Go back to the Beggining",
          "Stay on this page",
          "End Session"
        ]
      }
    ])
    .then(function(user) {
      switch (user.interSection) {
        case "Go back to the Beggining":
          begin();
          break;

        case "Stay on this page":
          countDown();
          break;

        case "End Session":
          console.log(
            divider +
              "\n" +
              "Thank you for using Bamazon, we look forward to your next visit!" +
              "\n" +
              divider
          );
          connection.end();
          break;
      }
    });
}
