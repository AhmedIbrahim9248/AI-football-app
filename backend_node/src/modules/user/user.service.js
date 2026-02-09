import { asyncHandler, successResponse } from "../../utils/response.js";
import { dec } from '../../utils/security/encrypt.security.js';
import { generateLoginCredintials } from '../../utils/security/token.security.js';

export const profile = asyncHandler(
    async (req, res, next) => {

        req.user.phone = dec({ cipherText: req.user.phone })

        return successResponse({ res, data: { user: req.user } })
    })

export const getNewLoginCredentials = asyncHandler(
    async (req, res, next) => { 

        const user = req.user
        const credentials = await generateLoginCredintials({ user })
        return successResponse({ res, data: { credentials} })
    })