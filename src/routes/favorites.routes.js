const { Router } = require ('express')

const FavoritesController = require ("../controllers/FavoritesController")

const favoritesController = new FavoritesController()
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const favoritesRoutes = Router()

favoritesRoutes.post('/',ensureAuthenticated ,favoritesController.create);
favoritesRoutes.delete('/:user_id/:dish_id',ensureAuthenticated ,favoritesController.removeFavorite);
favoritesRoutes.get('/:user_id', ensureAuthenticated,favoritesController.listFavorites);

module.exports = favoritesRoutes