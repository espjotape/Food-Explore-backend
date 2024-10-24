const { Router } = require ('express')

const FavoritesController = require ("../controllers/FavoritesController")

const favoritesController = new FavoritesController()

const favoritesRoutes = Router()

favoritesRoutes.post('/', favoritesController.create);
favoritesRoutes.delete('/:user_id/:dish_id', favoritesController.removeFavorite);
favoritesRoutes.get('/:user_id', favoritesController.listFavorites);

module.exports = favoritesRoutes