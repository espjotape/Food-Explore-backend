const knex = require("../database/knex");
const AppError = require("../utils/AppError.js");
const DiskStorage = require("../providers/DiskStorage.js")

class DishesController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;
    const image = request.file.filename;
  
    const diskStorage = new DiskStorage();
    const filename = await diskStorage.saveFile(image);
  
    const checkDishExists = await knex("dishes").where({ title }).first();
    if (checkDishExists) {
      throw new AppError("Este prato já existe no cardápio.");
    }
  
    let ingredientsArray = [];
    try {
      ingredientsArray = JSON.parse(ingredients); 
    } catch (error) {
      ingredientsArray = [];
    }
  
    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
      category,
      image: filename,
    });
  
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
    const { id } = request.params; 

   try {
     const dish = await knex("dishes").where({ id }).first();
  
     if (!dish) {
         throw new AppError("Prato não encontrado.", 404);
     }
   
     const dishUpdate = {
         title: title ?? dish.title,
         description: description ?? dish.description,
         category: category ?? dish.category,
         price: price ?? dish.price,
     };
     
     await knex("dishes").where({ id }).update(dishUpdate);
   
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
   
     if (ingredientsInsert) {
         await knex("ingredients").where({ dish_id: id }).delete();
         await knex("ingredients").insert(ingredientsInsert);
     }
   
     const updatedDish = await knex("dishes").where({ id }).first();
     return response.status(200).json(updatedDish);
   } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Erro ao atualizar o prato." });
  }
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
                .whereLike("dishes.title", `%${title || ''}%`)
                .whereIn("name", filterIngredients)
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                .groupBy("dishes.id")
                .orderBy("dishes.title");
        } else {
            dishes = await knex("dishes")
                .whereLike("title", `%${title || ''}%`)
                .orderBy("title");
        }

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
        console.error("Error fetching dishes:", error);
        return response.status(500).json({ message: "Erro ao buscar pratos." });
    }
}

}

module.exports = DishesController;
