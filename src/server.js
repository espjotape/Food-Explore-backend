require("dotenv").config()
require ("express-async-errors")
const migrationRun = require("./database/sqlite/index.js")
const uploadConfig = require("./configs/upload.js")
const AppError = require("./utils/AppError")
const express = require("express")
const cors = require("cors")

const routes = require("./routes/index.js")

migrationRun()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

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

const PORT = process.env.PORT|| 3333 
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))