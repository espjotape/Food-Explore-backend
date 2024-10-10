const { Router } = require("express")

const usersRouter = require("./users.routes")
const dishesRouter = require("./dishes.routes")
const sessionRoutes = require("./sessions.routes")

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/dishes', dishesRouter)
routes.use('/sessions', sessionRoutes)

module.exports = routes