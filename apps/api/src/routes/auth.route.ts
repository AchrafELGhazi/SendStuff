import { Router, type IRouter } from 'express'
import { register, login, refreshToken, getMe, logout, verifyEmail, changePassword } from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from '../schemas/auth.schema'

const router: IRouter = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken)

router.use(authenticateToken)

router.get('/me', getMe)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/change-password', validate(changePasswordSchema), changePassword)

export default router