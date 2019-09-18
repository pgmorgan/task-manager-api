const express = require('express')
const User = require("../models/user")
const auth = require("../middleware/auth")
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        //user.generateAuthToken() calls 'await user.save()' so no need to save() here.
        res.status(201).send({ user: user, token: token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send( {user: user, token: token} )
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => {
            return tokenObj.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

/*  The third arg of router.get - async (req, res) => () - only gets called if 
**  the next() function inside auth is called.
*/
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})



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
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router