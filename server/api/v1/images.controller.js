import ImagesDAO from "../../dao/ImagesDAO.js"
import { createHash } from "crypto"

export default class ImagesController {
    static async apiGetImages(req, res, next) {
        try {
            const projectName = req.body.projectName
            const creatorUserID = req.body.creatorUserID

            if (projectName === undefined || creatorUserID === undefined) {
                throw new Error("projectName or creatorUserID returned undefined, fields are required")
            }

            const reviewResponse = await ImagesDAO.getImages(projectName, creatorUserID)

            res.json({ status: "success", response: reviewResponse })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiPostImages(req, res, next) {
        try {
            const images = req.files
            const projectName = req.body.projectName
            const creatorUserID = req.body.creatorUserID

            if (projectName === undefined || creatorUserID === undefined) {
                throw new Error("Project Name or User ID is undefined.")
            }

            const reviewResponse = await ImagesDAO.addImages(projectName, creatorUserID, images)

            let imageURL
            for (let i = 0; i < reviewResponse.length; i++) {
                imageURL.append(reviewResponse[i].Location)
            }

            if (imageURL === []) {
                throw new Error("Unable to save any images.")
            }

            res.json({ status: "success", response: reviewResponse, imageURL: imageURL })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdateImages(req, res, next) {
        res.status(500).json({ error: "Feature WIP" })
    }

    static async apiDeleteImages(req, res, next) {
        try {
            const projectName = req.body.projectName
            const creatorUserID = req.body.creatorUserID
            const imageName = req.body.imageName

            if (projectName === undefined || creatorUserID === undefined) {
                throw new Error("projectName or creatorUserID returned undefined, unable to delete")
            }

            if (imageName === undefined || imageName === []) {
                throw new Error("imageName is undefined or contains no elements")
            }

            const folderName = createHash("sha256").update(`${projectName} | ${creatorUserID}`).digest("hex")

            const deleteResponse = await ImagesDAO.deleteImages(folderName, imageName.split(","))

            res.json({ status: "success", response: deleteResponse, deletedImagedWithName: imagesToDelete})
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}