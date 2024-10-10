const { Router } = require ('express')

const DishesController = require ("../controllers/DishesController")

const dishesController = new DishesController()

const dishesRoutes = Router()

dishesRoutes.post("/", dishesController.create)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.put("/:id", dishesController.update)

module.exports = dishesRoutes