const express = require("express")
const bcrypt = require("bcryptjs")
require("./db/mongoose")
const userRouter = require('./routers/user')
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3000

//  This is a middleware function.  It can do as much work as you wish.
// app.use((req, res, next) => {
//     res.status(503).send("The site is under maintenance.  Please try back soon.")
// })


// app.use((req, res, next) => {
//     if (req.method === "GET") {
//         res.send("GET requests are disabled")
//     } else {
//         next()
//     }
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
    
app.listen(port, () => {
    console.log("Server is up on port " + port)
})

const Task = require("./models/task")
const User = require("./models/user")


// const main = async () => {
    /*  Here we start with a task and find it's associated User */
    
    // const task = await Task.findById("5d8152e22273251649d31f6e")
    // await task.populate("owner").execPopulate()
    // console.log(task.owner)

    /*  Here we start with a User and find it's associated tasks (plural).
    **  Here we do it differently.  Instead of setting up a "tasks" array
    **  on the User model.  Rather we will be doing a virtual attribute.
    */

    // const user = await User.findById("5d8152de2273251649d31f6c")
    // await user.populate("myTasks").execPopulate()
// }

// main()