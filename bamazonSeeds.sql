DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(75) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Eyes of Newt", "Potion Ingredients", 15.40, 5), ("General Slime", "Potion Ingredients", 7.70, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bat Wings", "Potion Ingredients", 6.90, 7), ("Frog Skins", "Potion Ingredients", 11.30, 11);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Silver Dagger", "Murder Weapons", 75.20, 2), ("Poisoned Spike", "Murder Weapons", 55.70, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("12-Sided-Dice", "Nerdware", 2.23, 66), ("6-Sided-Dice", "Nerdware", 3.56, 42);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("20-Sided-Dice", "Nerdware", 7.40, 31), ("Graphing Calculator", "Nerdware", 87.70, 2);
