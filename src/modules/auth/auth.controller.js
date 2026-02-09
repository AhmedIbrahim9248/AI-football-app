import {Router} from 'express'
import * as authServices from './auth.services.js'

const router =Router()

router.post('/signUp',authServices.signUp)
router.post('/login',authServices.login)

router.patch('/confirmEmail',authServices.confirmEmail)
export default router