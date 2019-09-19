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
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return callback(new Error("Please upload a PDF"))
        }
        
        callback(undefined, true)
    },
})

app.post('/upload', upload.single("upload"), (req, res) => {
    res.send()   
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
    
app.listen(port, () => {
    console.log("Server is up on port " + port)
})

const Task = require("./models/task")
const User = require("./models/user")


