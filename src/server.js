require ("express-async-errors")
const migrationRun = require("./database/sqlite/index.js")
const AppError = require("./utils/AppError")
const express = require("express")
const cors = require("cors")

const routes = require("./routes/index.js")

migrationRun()

const app = express()
app.use(cors())
app.use(express.json())

app.use(routes)

app.use(( error, request, response, next) => {
 if (error instanceof AppError){
  return response.status(error.statusCode).json({
   status: "error",
   message: error.message
  })
 }

 console.log(error)

 return response.status(500).json({
  status: "error",
  message: "Internal server error"

 })
})

const PORT = 3333 
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))