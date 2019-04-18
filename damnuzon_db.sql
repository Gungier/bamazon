DROP DATABASE IF EXISTS damnUzon_db;
CREATE database damnUzon_db;

USE damnUzon_db;

CREATE TABLE products
(
  item_id INT(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR (100) NULL, 
  category_name VARCHAR (50) NULL,
  department_name VARCHAR (50) NULL,
  price DECIMAL (10,2) NULL,
  inventory_count INT (10) NULL,
  product_sales DECIMAL (10,2) null,
  PRIMARY KEY (item_id)
);

  INSERT INTO products
    (product_name, category_name, department_name, price, inventory_count)
  VALUES
    ('green couch', 'Furniture', 'Home & Kitchen', 499.99, 20),
    ('Longboard Skateboard', 'Sporting Good', 'Sports & Fitness', 89.95, 45),
    ('Salt and Pepper Set', 'Kitchenware', 'Home & Kitchen', 15.99, 10),
    ('Crossman BB Gun', 'Shooting Sports', 'Sports & Fitness', 77.85, 15),
    ('Look! A Menue, T-Shirt', 'T-Shirts', 'Clothing', 29.69, 20),
    ('Spaceballs', 'BluRay', 'Entertainment', 12.50, 10),
    ('MyPhone 13plus S', 'Mobile Phone', 'Electronics', 1998.98, 150),
    ('SexBox 720', 'Video Game Console', 'Electronics', 498.98, 75),
    ('StayStation 5', 'Video Game Console', 'Electronics', 645.32, 70),
    ('Super Skinny Capri Jeans', 'Mens Pants', 'Clothing', 125.50, 25),
    ('Cutting Board', 'Kitchenware', 'Home & Kitchen', 65.89, 4);

    CREATE TABLE departments (
      department_id INT(11) AUTO_INCREMENT NOT NULL,
      department_name VARCHAR(100) NULL,
      gross_overhead DECIMAL(10,2) NULL,
      PRIMARY KEY (department_id)
    );

    INSERT INTO departments
    (department_name, gross_overhead)
    VALUES
    ('Home & Kitchen', 10000),
    ('Sports & Fitness', 100000),
    ('Clothing', 50000),
    ('Entertainment', 150000),
    ('Electronics', 125000);