const knex = require("../database/knex")
const AppError = require("../utils/AppError.js");

class FavoritesController {
 async create( request, response ) {
  const { user_id, dish_id } = request.body

  //Verificando se o prato existe
  const checkDishExists = await knex('dishes')
  .where({ id: dish_id})
  .first()

  if (!checkDishExists) {
    throw new AppError("Prato não encontrado.", 404);
  }

 // Verificar se o usuário existe
  const checkUserExists = await knex('users')
  .where({ id: user_id })
  .first();

  if (!checkUserExists) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  // Verificar se o prato já está nos favoritos
  const existingFavorite = await knex('favorites')
  .where({ user_id, dish_id })
  .first();

  if (existingFavorite) {
    throw new AppError("Prato já está nos favoritos.");
  }
  
  await knex('favorites').insert({
    user_id,
    dish_id
  })

 return response.json({ message: "Prato adicionado aos favoritos com sucesso!" });
 }

 async removeFavorite(req, res) {
  const { user_id, dish_id } = req.params;

  // Remover o prato dos favoritos
  await knex('favorites')
    .where({ user_id, dish_id })
    .del();

  return res.status(200).json({ message: 'Prato removido dos favoritos' });
}

 async listFavorites(request, response) {
  const { user_id } = request.params;

  const favorites = await knex('favorites')
    .join('dishes', 'favorites.dish_id', 'dishes.id')
    .where('favorites.user_id', user_id)
    .select('dishes.id', 'dishes.title', 'dishes.image');

  return response.status(200).json(favorites);
}
};
 
module.exports = FavoritesController