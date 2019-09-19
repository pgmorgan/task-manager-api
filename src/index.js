const express = require("express")
const bcrypt = require("bcryptjs")
require("./db/mongoose")
const userRouter = require('./routers/user')
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT || 3000


const multer = require("multer")
const upload = multer({
    dest:   "img",
    limits: {
        fileSize:   1000000,       
    },
    fileFilter(req, file, callback) {
        

        /* How to send an error */
        // callback(new Error("File must be a PDF"))
        /* How to accept the file */
        // callback(undefined, true)
        /* How to reject the file */
        // callback(undefined, false)
    },
})
app.post('/upload', upload.single("upload"), (req, res) => {
    res.send()   
})


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
    
app.listen(port, () => {
    console.log("Server is up on port " + port)
})

const Task = require("./models/task")
const User = require("./models/user")


