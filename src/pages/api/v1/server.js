import express from "express"
import cors from "cors"

// Route Files

const app = express()
app.use(cors())
app.use(express.json())

app.use("*", (req, res) => res.status(404).json({error: "Not FOund"}))
app.use((err, req, res, next) => {
    const status = err.status || 500
    const msg = err.message || "Internal Server Error"
    res.status(status).send({ error: msg })
})

export default app