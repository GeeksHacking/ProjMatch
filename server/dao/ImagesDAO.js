import AWS from "aws-sdk"
import dotenv from "dotenv"
dotenv.config()

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECURITY_KEY
// })

// const BUCKET_NAME = process.env.AWS_BUCKET
// const S3 = new AWS.S3({
//     region: process.env.REGION,
// })
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECURITY_KEY,
    region: process.env.REGION
})

export default class ImagesDAO {
    static async getImages(filters = null) {
        let query
        if (filters) {
            if ("projectName" in filters) {
                query.projectName = filters.projectName
            } else {
                return "GET Request for Images requires the ProjectName"
            }

            if ("userID" in filters) {
                query.userID = filters.userID
            } else {
                return "GET Request for Images requires the User ID"
            }
        }
    }

    static async addImages() {

    }

    static async editImages() {

    }

    static async deleteImages() {

    }
}