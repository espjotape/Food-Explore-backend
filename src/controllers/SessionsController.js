const knex = require("../database/knex");
const AppError = require("../utils/AppError.js")

class SessionsController {
 async create(request, response){
  const { email, password } = request.body

  const user = await knex("users").where({ email }).first()
  if(!user){
   throw new AppError("Email e/ou sehha incorreta", 401)
  }

  return response.json({ email, password })
 }
}

module.exports = SessionsController