// Modules that need to be installed prior to operation -----------------------------------
const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");
const conTable = require("console.table");

// Connection verbage ------------------------------------------------------------------------
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "Michael Worthington",
    password: "gracieroot",
    database: "bamazondb"
});

// This gets the data from the database and sticks it into an array -----------------------------------
function start(){
    connection.query("SELECT * FROM products",function(error, result){
        if (error) throw error;
        const itemArr = [];
        for(var i = 0; i < result.length; i++){
            const saleObjects =
            {
                ID: chalk.blue(result[i].item_id),
                Name: chalk.bold(result[i].product_name),
                Dept: chalk.bold(result[i].department_name),
                Price: chalk.green("$" + result[i].price.toFixed(2)),
                Inventory: chalk.red(result[i].stock_quantity)
            }
            itemArr.push(saleObjects);
        }
 
        // Console.table module borrowed from class activities 'Great Bay' Week 12.
        // This module makes the data tables more aesthetically pleasing to view in terminal.
        // This sections pushes database into terminal -----------------------------------------------------------
        console.log("\n" + "\n" + "\n"+ "\n" + "\n" + "\n");
        console.log("------------------------------------------------------------------------------------------------");
        console.log(chalk.red("\n" + "WELCOME TO BLOODBATH AND BEYOND" + "\n"));
        console.log(console.table(itemArr));


        //This prompts user 2 questions: 1) What item to buy and 2) How many to buy? -------------------------------------
        inquirer.prompt([
            {
                type: "input",
                message: chalk.yellow("NerdFriend, what is the ID of the item you want to buy?"),
                choices: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                },
                name: "choiceID"
            },
            {
                type: "input",
                message: chalk.yellow("How many would you like to buy?"),
                amount: function(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false;
                },
                name: "quantity"
            }


        //This section checks number of items ordered versus number of items in inventory.
        //If demand exceeds inventory, 'Insufficient Quantity' alert is thrown to terminal window.      
        ]).then(function(response){
            const numQuantity = parseInt(response.quantity);
            connection.query(
                "SELECT stock_quantity,price,product_name FROM products WHERE ?",
                {
                    item_id: response.choiceID
                },
                function(error, selected){
                    if (error) throw error;
                    const data = selected[0];
                    if(numQuantity > data.stock_quantity){
                        console.log(chalk.red("\n" + "INSUFFICIENT QUANTITY  -- PLEASE TRY AGAIN, OH GREAT NERF HERDER!" + "\n"));
                        anotherTransaction();
                        
                        
                    }else{
                        updateQuantity(response.choiceID, numQuantity,
                        data.stock_quantity, data.price, data.product_name);
                    }
                })
        });
    });
    
}
    

// This section updates inventory in database ------------------------------------------------------------------
function updateQuantity(userChoiceId, userQuantity, 
    stockQuan, itemPrice, item_Name){
    const updateQuantity = stockQuan - userQuantity;
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: updateQuantity
            },
            {
                item_id: userChoiceId
            }
        // This section totals transaction amount and alerts user to item they purchased and amount they owe ------------
        ],function(error){
            if(error) throw error;

            const total = parseFloat(itemPrice) * userQuantity;
           
            console.log("\n" + (chalk.bold("You bought " + (userQuantity) + " " + (item_Name)
                + " for a total cost of " )) + (chalk.green("$" +total.toFixed(2))) + "\n");
           
            anotherTransaction();
        })
}

// Section that prompts user one question: 1) Buy another item? -----------------------------------------
function anotherTransaction(){
    inquirer.prompt([
        {
            type: "list",
            choices: ["Aye, gentle shopkeep.","Nay! A pox on thee!"],
            message: "Would you like to buy another item?",
            name: "again"
        }
    ]).then(function(response){
        if(response.again === "Aye, gentle shopkeep."){
            start();
        }else{
            console.log("\n" + "Thanks for your patronage, Nerd of Nerds!");

            // Important to end the connection so the program doesn't run continuously 
            connection.end();
        }
    })
}
start();
