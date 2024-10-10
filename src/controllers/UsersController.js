const AppError = require("../utils/AppError.js")
const sqliteConnection = require("../database/sqlite")
const UserRepository = require("../repositories/UserRepository.js")
const UserCreateService = require("../services/UserCreteService.js")
const knex = require("knex")

class UsersController {
 async create(request, response) {
  const { name, email, password } = request.body

  const userRepository = new UserRepository()
  const userCreateService = new UserCreateService(userRepository)

  await userCreateService.execute({ name, email, password })

  return response.status(201).json()
 }
}

module.exports = UsersController