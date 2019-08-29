DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products (
  item_id INT NOT NULL auto_increment,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);
INSERT INTO
  products (
    product_name,
    department_name,
    price,
    stock_quantity
  )
VALUES
  (
    "HOMENO Living Room Set 3 piece",
    "Home & Kitchen",
    758.99,
    5
  ),
  (
    "No Love Lost Coffee Mug",
    "Home & Kitchen",
    19.99,
    50
  ),
  (
    "MERN Tech Wireless Mouse",
    "Electronics",
    89.99,
    50
  ),
  (
    "ProtectR Pixel 10 XL Case",
    "Cell Phones & Accessories",
    99.99,
    30
  ),
  (
    "Mongo Bike Railings",
    "Outdoors",
    157.99,
    10
  ),
  (
    "Visyo Windows 30 laptop 15",
    "Personal Computers",
    999.99,
    10
  ),
  (
    "Taylor Swift Legacy Gamma-Ray collection",
    "Video, DVD & Blu-ray",
    99.99,
    30
  ),
  (
    "Deep Missunderstanding Shower Towel set",
    "Home & Personal Care",
    39.99,
    35
  ),
  (
    "Trilonax Analgesic Topical Cream 2%",
    "Home & Personal Care",
    15.99,
    100
  ),
  (
    "4Dblock Hoverble Sunscreen Shield",
    "Automotive & Powersports",
    49.99,
    20
  );