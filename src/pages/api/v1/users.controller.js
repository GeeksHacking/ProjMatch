import axios from "axios"

export default class UsersController {
    static async apiGetUsers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 1000
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.user) {
            filters.user = req.query.user
        } else if (req.query.email) {
            filters.email = req.query.email
        } else if (req.query.ph) {
            filters.ph = req.query.ph
        }


    }
}