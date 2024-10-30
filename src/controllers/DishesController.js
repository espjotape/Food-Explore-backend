const knex = require("../database/knex");
const AppError = require("../utils/AppError.js");
const DiskStorage = require("../providers/DiskStorage.js")

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body
    const image = request.file.filename;
    
    const diskStorage = new DiskStorage();
    const filename = await diskStorage.saveFile(image);


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
      image: filename,
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

  async update(request, response) {
    const { title, description, category, price, ingredients, image } = request.body;
    const { id } = request.params // id do prato que estamos atualizando

    // Busca o prato no banco de dados
    const dish = await knex("dishes").where({ id }).first();
  
    // Se o prato não for encontrado, retorne um erro
    if (!dish) {
      throw new AppError("Prato não encontrado.", 404);
    }
  
    // Atualiza as informações do prato se fornecidas, ou mantém as antigas
   const dishUpdate = {
    title: title ?? dish.title,
    description: description ?? dish.description,
    category: category ?? dish.category,
    price: price ?? dish.price,
   }
    // Atualizando as informações do prato pelo id
    await knex("dishes").where({ id }).update(dishUpdate);
  
    // Verifica e insere os ingredientes
    const hasOnlyOneIngredient = typeof(ingredients) === "string";
    let ingredientsInsert;
  
    if (hasOnlyOneIngredient) {
      ingredientsInsert = [{
        name: ingredients,
        dish_id: dish.id
      }];
    } else if (Array.isArray(ingredients) && ingredients.length > 0) {
      ingredientsInsert = ingredients.map(ingredient => {
        return {
          dish_id: dish.id,
          name: ingredient
        };
      });
    }
  
    // Remove os ingredientes antigos e insere os novos
    if (ingredientsInsert) {
      await knex("ingredients").where({ dish_id: id }).delete();
      await knex("ingredients").insert(ingredientsInsert);
    }
  
    return response.status(201).json('Prato atualizado com sucesso');
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
  
  async index(request, response) {
    // Capturando os parâmetros de consulta
    const { title, ingredients } = request.query;

    let dishes;

    try {
        if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
            
            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.title",
                    "dishes.description",
                    "dishes.category",
                    "dishes.price",
                    "dishes.image",
                ])
                .whereLike("dishes.title", `%${title || ''}%`) // Adicionando '' como fallback
                .whereIn("name", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                .groupBy("dishes.id")
                .orderBy("dishes.title");
        } else {
            dishes = await knex("dishes")
                .whereLike("title", `%${title || ''}%`) // Adicionando '' como fallback
                .orderBy("title");
        }

        console.log("Dishes found:", dishes); // Log para verificar os pratos encontrados

        // Verificando se pratos foram encontrados
        if (dishes.length === 0) {
            return response.status(404).json({ message: "Nenhum prato encontrado." });
        }

        const dishesIngredients = await knex("ingredients");

        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredient = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);
            return {
                ...dish,
                ingredients: dishIngredient
            };
        });

        return response.status(200).json(dishesWithIngredients);
    } catch (error) {
        console.error("Error fetching dishes:", error); // Log do erro
        return response.status(500).json({ message: "Erro ao buscar pratos." });
    }
}

}

module.exports = DishesController;
