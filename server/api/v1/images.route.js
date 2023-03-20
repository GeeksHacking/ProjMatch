import express from "express"
import ImageController from "./images.controller.js"

const router = express.Router()

router.route("/")
    .get(ImageController.apiGetImages)
    .post(ImageController.apiPostImages)
    .delete(ImageController.apiDeleteImages)

export default router