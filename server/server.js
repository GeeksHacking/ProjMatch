import express from "express"
import cors from "cors"
// Route Files
import users from "./api/v1/users.route.js"

// Server Setup
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/users", users)
app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))

export default app