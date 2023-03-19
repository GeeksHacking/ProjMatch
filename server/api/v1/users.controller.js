import UsersDAO from "../../dao/UsersDAO.js"

export default class UsersController {
    static async apiGetUsers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 100
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.users) {
            filters.users = req.query.users
        } else if (req.query.pw) {
            filters.pw = req.query.pw
        }

        const { usersList, totalUsers }= await UsersDAO.getUsers({
            filters,
            page,
            usersPerPage
        })

        let response = {
            users: usersList,
            page: page,
            filters: filters,
            usersPerPage: usersPerPage,
            totalUsers: totalUsers
        }
        res.json(response)
    }

    static async apiPostUsers(req, res, next) {
        try {
            const userID = req.body.userID
            const pw = req.body.pw

            const date = new Date()

            const userRes = await UsersDAO.addUser(user, pw, date)
            res.json({ status: "success" })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}