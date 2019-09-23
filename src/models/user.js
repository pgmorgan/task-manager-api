const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("../models/task")

/*  MONGOOSE USER SCHEMA */
const userSchema = new mongoose.Schema({
    name:   {
        type:       String,
        required:   true,
        trim:       true,
    },
    email:  {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true,
        lowercase:  true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        },
    },
    password:   {
        type:       String,
        required:   true,
        trim:       true,
        minlength:  7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password is invalid")
            }
        },
    },
    age:    {
        type:       Number,
        default:    0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        },
    },
    tokens: [{
        token: {
            type:       String,
            required:   true,
        },
    }],
    avatar: {
        type:       Buffer,
    },
}, {
    timestamps:     true,
})

userSchema.virtual("myTasks", {
    ref:            'Task',
    localField:     "_id",
    foreignField:   "owner",
})

/*  EXPRESS TOJSON  */
/*  When we pass a JS object off to express with res.send(myObj),
**  In the background, express is making a call to JSON.stringify(myObj).
**  "toJSON" seems to be a built-in function in Express which is called
**  everytime you stringify a JS object.  Whatever "toJSON" returns is
**  what will be stringified.
*/
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

/*  GENERATE AUTH TOKENS - "METHODS" METHOD AVAILABLE ON INSTANCES OF USER    */
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}

/*  FIND BY CREDENTIALS - "STATICS" METHOD AVAILABLE ON THE MODEL USER  */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}

/*  Certain mongoose methods bypass more advanced features like middleware,
    such as our update route which will bypass this userSchema.pre

    findById and update directly modify the database

    Needs to be a regular function below, and not an arrow function
    because arrow functions don't bind the 'this' argument.
*/

/*  MIDDLEWARE CALLED BEFORE SAVE() METHOD ON USER INSTANCE */
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
    // If we never call next() it will hang forever and never save the User.
    // 'next()' is a way of ensuring that not just the function has been run but all asynchronous 
    // processes have also been completed.  It is thus a similar but different from "await"
})

/*  MIDDLEWARE CALLED BEFORE REMOVE() METHOD ON USER INSTANCE */
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User