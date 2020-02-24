const express = require("express")
const bcrypt = require("bcryptjs")
const cors = require("cors")
require("./db/mongoose")
const userRouter = require('./routers/user')
const taskRouter = require("./routers/task")

/*	SETUP NEW EXPRESS APP	*/
const app = express()

/*	SETUP EXPRESS ROUTERS	*/
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(taskRouter)
    
/*	LISTEN AND SERVE ON CHOSEN PORT	*/
const port = process.env.PORT
app.listen(port, () => {
    console.log("Server is up on port " + port)
})
