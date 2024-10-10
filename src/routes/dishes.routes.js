const { Router } = require ('express')

const DishesController = require ("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()

const dishesRoutes = Router()

dishesRoutes.get("/", dishesController.index)
dishesRoutes.post("/", dishesController.create)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.put("/:id", ensureAuthenticated ,dishesController.update)

module.exports = dishesRoutes