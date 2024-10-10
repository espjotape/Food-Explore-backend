const knex = require("../database/knex");
const AppError = require("../utils/AppError.js");

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;
    
    // Verifica se o prato já existe
    const checkDishExists = await knex("dishes").where({ title }).first();
    
    if (checkDishExists) {
      throw new AppError("Este prato já existe no cardápio.");
    }

    // Verifica se ingredients é um array, caso contrário inicializa com array vazio
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : [];

    // Insere o prato
    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
      category,
    });

    // Mapeia os ingredientes para serem inseridos com o dish_id
    const ingredientsInsert = ingredientsArray.map((name) => {
      return {
        dish_id,
        name,
      };
    });

    if (ingredientsInsert.length > 0) {
      await knex("ingredients").insert(ingredientsInsert);
    }
    
    return response.json({ message: "Prato criado com sucesso!" });
  }
  
  async show(request, response){
    const { id } = request.params

    const dish = await knex("dishes").where({ id }).first()
    const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

    return response.status(201).json({
    ...dish,
    ingredients
    })
  }
  
  async delete(request, response){
    const { id } = request.params 

    await knex("dishes").where({ id }).delete();

    return response.json({ message: "Prato deletado com sucesso!" });
  }
}

module.exports = DishesController;
