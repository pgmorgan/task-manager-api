const express = require("express")
const Task = require("../models/task")
const auth = require("../middleware/auth")
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        /*  ES6 spread operator is like what Todd McCleod calls "Unfurling" in Golang.
        **  It grabs all of the properties from "req.body" in this case and copies them
        **  to this object.  Here we're copying the 'description' and 'completed' properties.
        */
        ...req.body,
        owner:      req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(error)
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((updateKeyName) => {
        return allowedUpdates.includes(updateKeyName)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
            return
        }
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/tasks", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id })
        /* You could also replace the line above with:
        **      await req.user.populate("myTasks").execPopulate()
        */
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(error)
    }
})

module.exports = router