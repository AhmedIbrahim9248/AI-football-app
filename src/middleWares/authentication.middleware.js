import { asyHandler } from "../utils/response.js";
import { decodedToken, tokenTypeEnum } from "../utils/security/token.security.js";


export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {
    return asyHandler(
        async (req, res, next) => {

            req.user = await decodedToken({
                next,
                authorization: req.headers.authorization,
                tokenType
            })


            return next()
        })
}
