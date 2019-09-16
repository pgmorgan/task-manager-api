const mongoose = require("mongoose")

const atlasUser = "root"
const atlasPassword = "root"
const clusterName = "cluster0"
const databaseName = "task-manager-api"

let connectionURL = "mongodb+srv://" + atlasUser + ":" + atlasPassword
connectionURL += "@" + clusterName + "-a6bbr.mongodb.net/" + databaseName 
connectionURL += "?retryWrites=true&w=majority"

mongoose.connect(connectionURL, {
    useNewUrlParser:    true, 
    useUnifiedTopology: true,
    useCreateIndex:     true,
})
 
