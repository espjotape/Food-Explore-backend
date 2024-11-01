const { Router } = require('express');

const OrdersController = require("../controllers/OrdersController");

const ordersController = new OrdersController()

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const ordersRoutes = Router();


ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/", ordersController.create);
ordersRoutes.get("/", ordersController.index); 
ordersRoutes.put("/", ordersController.update); 
ordersRoutes.delete("/:id", ordersController.delete) 

module.exports = ordersRoutes;
