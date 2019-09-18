const mongoose = require("mongoose")

const Task = mongoose.model("Task", {
    description:   {
        type:       String,
        required:   true,
        trim:       true,
    },
    completed: {
        type:       Boolean,
        default:    false,
    },
    owner:  {
        type:       mongoose.Schema.Types.ObjectId,
        required:   true,
        /*  "ref" property enables you to link two different 
        **  mongoose models.  Thus we can fetch the entire public
        **  profile of a user whenever we have a task ID.
        **
        **  You access the "User" instance associated with owner ID
        **  by using the syntax:
        **      task.populate("owner").execPopulate()
        */
        ref:        "User"                
    },
})

module.exports = Task