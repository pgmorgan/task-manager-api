const express = require("express")
const bcrypt = require("bcryptjs")
require("./db/mongoose")
const User = require("./models/user")
const Task = require("./models/task")
const userRouter = require('./routers/user')
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
    
app.listen(port, () => {
    console.log("Server is up on port " + port)
})

const myFunction = async () => {

}