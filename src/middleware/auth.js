const jwt = require("jsonwebtoken")
const User = require("../models/user")

/*  USER AUTHORIZATION MIDDLEWARE CALLED AT NEARLY EVERY HTTP METHOD WITH JWT TOKENS    */
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch(e) {
        res.status(401).send({ error: "Please authenticate." })
    }
}

module.exports = auth