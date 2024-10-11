const { Router, response } = require ('express')
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const DishesController = require ("../controllers/DishesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const dishesController = new DishesController()

const dishesRoutes = Router()
const upload = multer(uploadConfig.MULTER)

dishesRoutes.get("/", dishesController.index)
dishesRoutes.post("/", dishesController.create)
dishesRoutes.get("/:id", dishesController.show)
dishesRoutes.delete("/:id", dishesController.delete)
dishesRoutes.put("/:id", ensureAuthenticated ,dishesController.update)
dishesRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), (req, response) => {
 console.log(req.file.filename)
})

module.exports = dishesRoutes