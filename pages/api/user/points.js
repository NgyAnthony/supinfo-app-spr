import { prisma } from "../../../services/prisma-provider";

export default async function handler(req, res) {
    if (req.body.user != null && req.body.user.email_verified) {
        let existsCount = await prisma.points.count(
            {
                where: {
                    Login: req.body.user.email
                }
            }
        )

        if (existsCount === 1) {
            const user_points = await prisma.points.findUnique({
                where: {
                    Login: req.body.user.email
                }
            })

            delete user_points.Login

            for (const key in user_points) {
                if (user_points.hasOwnProperty(key)) {
                    if (user_points[key] === ""){
                        user_points[key] = 0
                    } else {
                        user_points[key] = parseInt(user_points[key])
                    }
                }
            }

            res.status(200).json(user_points)
        } else {
            const noUserFetched = {
                "message": 'DOES_NOT_EXIST'
            }
            res.status(200).json(noUserFetched)
        }
    } else {
        const notLoggedIn = {
            "message": 'NOT_LOGGED_IN'
        }
        res.status(200).json(notLoggedIn)
    }
}
