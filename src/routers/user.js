const express = require('express')
const User = require("../models/user")
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get("/users/:id", async (req, res) => {
    try {
        // if (!ObjectID.isValid(req.params.id)) {
        //     res.status(404).send()
        //     return
        // }
        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).send()
            return
        }
        res.status(200).send(user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    // Object.keys(theActualObject) returns an array of just the keys in the key value pair
    // This is a built-in method in Javascript, no libraries required it seems.
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }) 
        if (!user) {
            res.status(404).send()
            return
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            res.status(404).send()
            return
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router