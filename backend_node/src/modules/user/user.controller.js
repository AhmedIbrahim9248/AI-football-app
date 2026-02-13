import * as userService from './user.service.js'
import { Router } from 'express'
import { authentication } from '../../middleWares/auth.middleware.js'
import { tokenTypeEnum } from '../../utils/security/token.security.js'
const router = Router()

router.get('/', authentication(), userService.profile)
router.get(
    '/refresh-token',
    authentication({ tokenType : tokenTypeEnum.refresh}),
    userService.getNewLoginCredentials
)

export default router