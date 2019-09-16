const express = require("express")
const Task = require("../models/task")
const router = new express.Router()

router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((updateKeyName) => {
        return allowedUpdates.includes(updateKeyName)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findbyID(req.params.id)
        if (!task) {
            res.status(404).send()
            return
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(error)
    }
})


router.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(error)
    }
})

module.exports = router