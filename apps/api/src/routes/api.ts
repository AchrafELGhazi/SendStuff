import { Router, type IRouter } from 'express'
import authRoutes from './auth.route'

const router: IRouter = Router()

router.use('/auth', authRoutes)

export default router