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
        
    }

    static async apiUpdateImages(req, res, next) {
        
    }

    static async apiDeleteImages(req, res, next) {
        
    }
}