import ImagesDAO from "../../dao/ImagesDAO.js"

export default class ImagesController {
    static async apiGetImages(req, res, next) {
        try {
            let filters = {}
            if (req.query.projectName) {
                filters.projectName = req.query.projectName
            }
            if (req.query.userID) {
                filters.userID = req.query.userID
            }
            if (req.query.tags) {
                filters.tags = req.query.tags
            }

            const images = await ImagesDAO.getImages(filters)
            console.log(images)

            let response = {
                images: images,
                filters: filters
            }

            res.json(response)
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
            res.json({ status: "success", result: reviewResponse })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdateImages(req, res, next) {
        
    }

    static async apiDeleteImages(req, res, next) {
        
    }
}