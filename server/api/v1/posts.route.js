import express from "express"
import PostsController from "./posts.controller.js"

const router = express.Router()

router.route("/")
    .get(PostsController.apiGetPosts)
    .post(PostsController.apiPostPosts)

export default router