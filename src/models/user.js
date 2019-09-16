const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

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
})

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

//Certain mongoose methods bypass more advanced features like middleware,
//such as our update route which will bypass this userSchema.pre

//findById and update directly modify the database

//Needs to be a regular function below, and not an arrow function
//because arrow functions don't bind the 'this' argument.
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
    // If we never call next() it will hang forever and never save the User.
    // 'next()' is a way of ensuring that not just the function has been run but all asynchronous 
    // processes have also been completed.  It is thus a similar but different from "await"
})

const User = mongoose.model("User", userSchema)

module.exports = User

// const peter = new User({
//     name:   "Peter",
//     email:  "petergm@gmail.com",
//     password:   "hellopass",
// })

// peter.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log("Error!", error)
// })