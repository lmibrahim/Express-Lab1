"use strict";

const express = require("express");

const routes = express.Router();

const cartItems = [
  { id: 1, product: "Vaseline", price: 7, quantity: 4 },
  { id: 2, product: "Water", price: 3, quantity: 20 },
  { id: 3, product: "Hairbrush", price: 6, quantity: 1 },
  { id: 4, product: "Toothpicks", price: 1, quantity: 1 },
  { id: 5, product: "Lysol", price: 30, quantity: 20 },
];
let nextId = 6;

// 1. GET /cart-items
// a. Action: None
// b. Response: a JSON array of all cart items
// c. Response Code: 200 (OK)
// d. Query string parameters: the request may have one of the following or it may
// have none. (See tests below for examples.)
// i. maxPrice - if specified, only include products that are at or below this
// price.
// ii. prefix - if specified, only includes products that start with the given
// string in the response array.
// iii. pageSize - if specified, only includes up to the given number of items in
// the response array. For example, if there are ten items total, but
// pageSize=5, only return an array of the first five items

routes.get("/cart-items", (req, res) => {
  let maxPrice = req.query.maxPrice;
  let prefix = req.query.prefix;
  let pageSize = req.query.pageSize;
  let filteredItems = cartItems;
  if (prefix) {
    filteredItems = filteredItems.filter((item) => {
      return item.product.toLowerCase().includes(prefix.toLowerCase().trim());
    });
  }
  if (maxPrice) {
    filteredItems = filteredItems.filter((item) => {
      return item.price <= parseInt(maxPrice);
    });
  }
  if (pageSize) {
    filteredItems = filteredItems.filter((item) => {
      return item.quantity === parseInt(pageSize);
    });
  }
  res.json(filteredItems);
});

// 2. GET /cart-items/:id
// a. Action: None
// b. Response: a JSON object of the item with the given ID
// c. Response Code: 200 (OK)
// d. However, if the item with that ID cannot be found in the array, return a string
// response “ID Not Found” with response code 404 (Not Found)
routes.get("/cart-items/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let foundItem = cartItems.find((item) => {
    return item.id === id;
  });
  if (foundItem) {
    res.json(foundItem);
  } else {
    res.send(`ID Not Found`);
  }

  res.json(foundItem);
});

// 3. POST /cart-items
// a. Action: Add a cart item to the array using the JSON body of the request. Also
// generate a unique ID for that item.
// b. Response: the added cart item object as JSON.
// c. Response Code: 201 (Created)

routes.post("/cart-items", (req, res) => {
  let item = req.body;
  item.id = nextId++;
  cartItems.push(item);
  res.status(201);
  res.json(item);
});

// 4. PUT /cart-items/:id
// a. Action: Update the cart item in the array that has the given id. Use the JSON
// body of the request as the new properties.
// b. Response: the updated cart item object as JSON.
// c. Response Code: 200 (OK).

routes.put("/cart-items", (req, res) => {
  let id = parseInt(req.params.id);
  let updatedItem = req.body;
  updatedItem.id = id;
  let index = cartItems.findIndex((item) => {
    return item.id === id;
  });
  if (index === -1) {
    res.status(404);
    res.send(`No item found with id: ${id}`);
  } else {
    cartItems[index] = updatedItem;
    res.json(updatedItem);
  }
});

// 5. DELETE /cart-items/:id
// a. Action: Remove the item from the array that has the given ID.
// b. Response: Empty
// c. Response Code: 204 (No Content)

routes.delete("/cart-items", (req, res) => {
  let id = parseInt(req.params.id);
  let index = cartItems.findIndex((item) => {
    return item.id === id;
  });
  if (index === -1) {
    res.status(404);
    res.send(`No item found with id: ${id}`);
  } else {
    cartItems.splice(index, 1);
    res.sendStatus(204);
  }
});

module.exports = routes;
