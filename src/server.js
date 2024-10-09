const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3333 
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))