var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "groot",
    database: "Bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    productDisp();
});

var productIdArr = [];
var quantitySelected = [];
var quantityArr = [];
var priceArr = [];
var index = 0;
var total = 0;

function productDisp() {
    connection.query("SELECT * FROM Products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].ID + " | " + res[i].Product_Name + " | $" + res[i].Price + " | Dept: " + res[i].Department_Name);
        }
        console.log("-----------------------------------");
        productSelector();
    });
}

function productSelector() {

    inquirer.prompt([
        {
            type: 'confirm',
            name: 'purchaseInquirer',
            message: 'Would you like to make a purchase?',
        }
    ]).then(function (user) {
        if (user.purchaseInquirer === true) {
            productIdArr = [];
            quantityArr = [];
            quantitySelected = [];
            connection.query("SELECT * FROM Products", function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    productIdArr.push('' + res[i].ID + '');
                }
                inquirer.prompt([
                    {
                        type: "checkbox",
                        name: "productSelector",
                        message: "Which item(s) would you like to purchase? (select by ID)",
                        choices: productIdArr,
                        validate: function(answers) {
                            if (answers.length < 1) {
                                return "You must select at least ONE product!";
                            }
                            return true;
                        }
                    }
                ]).then(function (answers) {
                    var userData = answers.productSelector;
                    for (var x = 0; x < userData.length; x++) {
                        connection.query("SELECT Stock_Quantity FROM Products WHERE ID = " + userData[x], function (err, res) {
                            if (err) throw err;
                            quantityArr.push(res[0].Stock_Quantity);
                        });
                        connection.query("SELECT Price FROM Products WHERE ID = " + userData[x], function (err, res) {
                            if (err) throw err;
                            priceArr.push(res[0].Price);
                        });
                    };    
                    // console.log(quantityArr);


                    var getQuantity = function() {
                        var productId = answers.productSelector[index];
                        if (userData.length > quantitySelected.length) {
                            inquirer.prompt([
                                {
                                    type: "input",
                                    name: "quantity",
                                    message: "How much of item " + productId + "?",
                                }
                            ]).then(function (qty) {
                                quantitySelected.push(qty.quantity);
                                // console.log(quantitySelected);
                                if (quantitySelected[index] > quantityArr[index]) {
                                    console.log("Insufficient Quantity for item: " + userData[index] + "!");
                                    console.log("Please try a different Quantity");
                                    quantitySelected = [];
                                    index = 0;
                                    getQuantity();
                                } else {
                                index++;
                                getQuantity();
                                };
                            });                        
                        }
                        else {
                            for (m = 0; m < userData.length; m++) {
                                // console.log(userData[m]); 
                                connection.query(
                                    "UPDATE Products SET ? WHERE ?",
                                    [
                                        {
                                            Stock_Quantity: quantityArr[m] - quantitySelected[m]
                                        },
                                        {
                                            ID: userData[m]
                                        }
                                    ],
                                    function (error) {
                                        if (error) throw err;
                                    }
                                );
                                console.log("Item " + userData[m] + " Order Status: Confirmed!");
                                total += quantitySelected[m] * priceArr[m];
                            }     
                            console.log("Your total cost today is: $" + total);
                            // console.log(userData);
                            // console.log(quantitySelected);
                            // console.log(quantityArr);
                            // console.log(priceArr);
                            connection.end();
                        }
                    };
                    getQuantity();
                });

            });
            // console.log(productIdArr);   
        }
        else {
            console.log("Come back next time!");
            connection.end();
        }
    });           
}
