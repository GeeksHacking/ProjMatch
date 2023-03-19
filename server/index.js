import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

// DAO
import UsersDAO from "./dao/UsersDAO.js"
import PostsDAO from "./dao/PostsDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8080

MongoClient.connect(process.env.ATLAS_URI)
.catch(err => {
    console.log("HI")
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await UsersDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})