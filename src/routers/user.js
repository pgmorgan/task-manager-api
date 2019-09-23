const express = require('express')
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/user")
const auth = require("../middleware/auth")
const { sendWelcomeEmail, sendCancellationEmail } = require("../emails/account")

const router = new express.Router()

/*  POST - CREATE USER ACCOUNT  */
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        /*  sendWelcomeEmail is asynchronous but there's no need to await for it */
        sendWelcomeEmail(user.email, user.name)
        /*  user.generateAuthToken() calls 'await user.save()' so no need to save() above in fact. */
        res.status(201).send({ user: user, token: token })
    } catch(e) {
        res.status(400).send(e)
    }
})

/*  POST - LOGIN USER   */
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send( {user: user, token: token} )
    } catch (e) {
        res.status(400).send(e)
    }
})

/*  POST - LOGOUT USER  */
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

/*  POST - LOGOUT USER FROM ALL SESSIONS/BROWSERS   */
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

/*  GET - RETRIEVE USER INFO    */
/*  The third arg of router.get - async (req, res) => () - only gets called if 
**  the next() function inside auth is called.
*/
router.get("/users/me", auth, async (req, res) => {
    res.status(200).send(req.user)
})

/*  PATCH - UPDATE USER INFO    */
router.patch("/users/me", auth, async (req, res) => {
    /*  Object.keys(theActualObject) returns an array of just the keys in the key value pair.
    **  This is a built-in method in Javascript, no libraries required it seems.
    */
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        /*  Each call to instance.save() grabs the "_id" value from the instance and 
        **  adjusts the corresponding entry in the database.  That's how we can take 
        **  the "user" object that is a property of the request, and save it to overwrite
        **  whatever is saved in the "user" object in the MongoDB database.
        */
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

/*  We are able to access "req.user._id" because in the auth() middleware function
**  we attached "user" (as well as "token") to the request object.
**  This is fundamentally the architecture of this web App from an authentication
**  perspective.  We send the user and token in the response to login or create requests.
**  In Postman we take that token and attach it to all other future requests.
**  In a web app with a front end we would have to figure out how to attach the token to future requests.
**  In a JSON/XML API I suppose we would always be providing the API Key with each request.
**  Then subsequent requests to the server come with the token attached to the request 
**  (not to it's body but to the base request object).  Any response that requires authentication
**  can check that token and proceed.
*/

/*  DELETE - DELETE USER ACCOUNT    */
router.delete("/users/me", auth, async (req, res) => {
    try {
        sendCancellationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

/*  POST - UPLOAD USER AVATAR   */
const upload = multer({
    // dest:   "avatars",
    limits: {
        fileSize:   1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("Please upload a JPG, JPEG, or PNG file"))
        }
        callback(undefined, true)
    },
})

router.post("/users/me/avatar", auth, upload.single("myAvatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
/*  END OF POST - UPLOAD USER AVATAR    */

/*  DELETE - DELETE USER AVATAR */
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})

/*  GET - FETCH USER AVATAR */
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
           throw new Error()
        }

        /*  So far express has been setting the Content-Type header for us */
        res.set("Content-Type", "image/png")
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router