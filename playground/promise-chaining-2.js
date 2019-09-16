require('../src/db/mongoose')
const Task = require('../src/models/task')

// 5d7bf919b86bd31efa4266cb

// Task.findByIdAndDelete("5d7c0999176b0b2d00e192c0").then((result) => {
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id)
    return await Task.countDocuments({ completed: false })
}

deleteTaskAndCount("5d7fa20f2b535c1653617d4f").then((count) => {
    console.log(count)
}).catch((e) => {
    console.log("Error: ", e)
})