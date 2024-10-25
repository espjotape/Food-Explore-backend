const knex = require("../database/knex")
const AppError = require("../utils/AppError.js");

class FavoritesController {
  async create(request, response) {
    const { dish_id } = request.body;
    const user_id = request.user.id;
  
    try {
      console.log("Tentando adicionar aos favoritos:", { user_id, dish_id });
  
      // Verificação do prato
      const checkDishExists = await knex('dishes')
        .where({ id: dish_id })
        .first();
      if (!checkDishExists) {
        throw new AppError("Prato não encontrado.", 404);
      }
  
      // Verificação do usuário
      const checkUserExists = await knex('users')
        .where({ id: user_id })
        .first();
      if (!checkUserExists) {
        throw new AppError("Usuário não encontrado.", 404);
      }
  
      // Verificação de prato já favoritado
      const existingFavorite = await knex('favorites')
        .where({ user_id, dish_id })
        .first();
      if (existingFavorite) {
        throw new AppError("Prato já está nos favoritos.", 400);
      }
  
      // Inserção nos favoritos
      await knex('favorites').insert({ user_id, dish_id });
  
      return response.json({ message: "Prato adicionado aos favoritos com sucesso!" });
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      return response.status(400).json({ error: error.message });
    }
  }
  

 async removeFavorite(req, res) {
  const { dish_id } = req.params;
  const user_id = req.user.id

  // Remover o prato dos favoritos
  await knex('favorites')
    .where({ user_id, dish_id })
    .del();

  return res.status(200).json({ message: 'Prato removido dos favoritos' });
}

 async listFavorites(request, response) {
  const  user_id  = request.user.id;

  const favorites = await knex('favorites')
    .join('dishes', 'favorites.dish_id', 'dishes.id')
    .where('favorites.user_id', user_id)
    .select('dishes.id', 'dishes.title', 'dishes.image');

  return response.status(200).json(favorites);
}
};
 
module.exports = FavoritesController