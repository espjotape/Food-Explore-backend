const { Router } = require ('express')
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesImageController = require("../controllers/DishesImageController")
const DishesController = require ("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()
const dishesImageController = new DishesImageController()

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

dishesRoutes.get("/", dishesController.index)
dishesRoutes.post("/", dishesController.create)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.put("/:id", ensureAuthenticated ,dishesController.update)
dishesRoutes.patch("/avatar/:id", ensureAuthenticated, upload.single("avatar"), dishesImageController.update)
dishesRoutes.get('/images/:image', dishesImageController.show);

module.exports = dishesRoutes