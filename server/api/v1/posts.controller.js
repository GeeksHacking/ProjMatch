import PostsDAO from "../../dao/PostsDAO.js"

export default class PostsController {
    static async apiGetPosts(req, res, next) {
        const postsPerPage = req.query.postsPerPage ? parseInt(req.query.postsPerPage, 10) : 100
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        // filter goes here

        const { postsList, totalPosts } = await PostsDAO.getPosts({
            filters,
            page,
            postsPerPage
        })

        let response = {
            posts: postsList,
            page: page,
            filters: filters,
            postsPerPage: postsPerPage,
            totalPosts: totalPosts
        }
        res.json(response)
    }

    static async apiPostPosts(req, res, next) {
        try {
            const projectName = req.body.projectName
            const description = req.body.description
            const creatorUserID = req.body.creatorUserID
            const rating = req.body.rating
            const tags = req.body.tags
            const technologies = req.body.technologies
            const images = req.body.images

            const reviewResponse = await PostsDAO.addProject(projectName, description, creatorUserID, rating, tags, technologies, images)

            res.json({ status: "success" })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }

    static async apiUpdatePosts(req, res, next) {
        // TODO
    }

    static async apiDeletePosts(req, res, next) {
        try {
            
            res.json({ status: "success" })
        } catch (err) {
            res.status(500).json({ error: `Unable to delete post as ${err.message}` })
        }
    }
}