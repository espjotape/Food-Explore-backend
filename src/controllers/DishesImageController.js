const knex = require("../database/knex/index.js");
const AppError = require("../utils/AppError.js");
const DiskStorage = require("../providers/DiskStorage.js");

class DishesImageController {
 async update(request, response){
  const { id }  = request.params
  const imageFileName = request.file.filename

  const diskStorage = new DiskStorage

  const dish = await knex("dishes").where({ id }).first()
  if (!dish) {
   throw new AppError("Prato não encontrado.", 404);
 }

 if(dish.image) {
  await diskStorage.deleteFile(dish.image)
 }

 const filename = await diskStorage.saveFile(imageFileName)
 dish.image = filename

 await knex("dishes").update(dish).where({ id })

 return response.json(dish)
 }
}

module.exports = DishesImageController