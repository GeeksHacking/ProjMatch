import express from "express"
import cors from "cors"
import dotenv from "dotenv"
// import { auth } from "express-oauth2-jwt-bearer"
// Route Files
import users from "./api/v1/users.route.js"
import images from "./api/v1/images.route.js"
import posts from "./api/v1/posts.route.js"

dotenv.config()

// Server Setup
const app = express()
// const jwtCheck = auth({
//     audience: 'https://localhost:8080',
//     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//     tokenSigningAlg: "RS256"
// })

// app.use(jwtCheck)
app.use(cors())
app.use(express.json())

// app.get('/authorized', function (req, res) {
//     res.send('Secured Resource');
// });

app.use("/api/v1/users", users)
app.use("/api/v1/images", images)
app.use("/api/v1/posts", posts)
app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))

export default app